const connection = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    // Listar todos os usuários (Admin/Professor vê a matrícula)
    async index(req, res) {
        if (req.usuarioTipo !== 'professor' && req.usuarioTipo !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado. Apenas professores ou admin podem listar usuários.' });
        }

        try {
            const usuarios = await connection('usuarios')
                .select('id as matricula', 'nome', 'email', 'tipo', 'semestre_atual');
            return res.json(usuarios);
        } catch (error) {
            console.error("Erro ao listar usuários:", error);
            return res.status(500).json({ error: 'Erro ao buscar usuários.' });
        }
    },

    // Criar um novo aluno com Matrícula Manual e Subtabela
    async create(req, res) {
        const { 
            matricula, // Agora recebemos a matrícula do aluno
            nome, 
            nomeCompleto, 
            email, 
            senha, 
            tipo, 
            semestre_atual,
            telefone,
            cpf,
            data_nascimento,
            especialidade_interesse
        } = req.body;

        const nomeFinal = nome || nomeCompleto;

        // Validação básica: Matrícula agora é obrigatória!
        if (!matricula || !nomeFinal || !email || !senha) {
            return res.status(400).json({ error: 'Dados incompletos. Matrícula, nome, e-mail e senha são obrigatórios.' });
        }

        // Iniciamos a transação
        const trx = await connection.transaction();

        try {
            // Lógica de definição de tipo (Proteção para não criarem admin via cadastro aberto)
            let tipoFinal = 'aluno';
            if (req.usuarioId && req.usuarioTipo === 'admin') {
                tipoFinal = tipo || 'aluno';
            } else if (tipo === 'professor' || tipo === 'admin') {
                await trx.rollback();
                return res.status(403).json({ error: 'Acesso negado. Somente administradores criam perfis elevados.' });
            }

            const salt = await bcrypt.genSalt(10);
            const senhaCriptografada = await bcrypt.hash(senha, salt);

            // 1. Inserção na tabela principal 'usuarios' usando a matrícula como ID
            await trx('usuarios').insert({
                id: matricula, 
                nome: nomeFinal,
                email: email.toLowerCase().trim(),
                senha: senhaCriptografada,
                tipo: tipoFinal,
                semestre_atual: (semestre_atual && !isNaN(semestre_atual)) ? parseInt(semestre_atual) : 1
            });

            // 2. Inserção na nova subtabela 'aluno_detalhes'
            // Isso só acontece se o tipo for aluno
            if (tipoFinal === 'aluno') {
                await trx('aluno_detalhes').insert({
                    usuario_id: matricula,
                    telefone,
                    cpf,
                    data_nascimento,
                    especialidade_interesse
                });
            }

            // Se tudo deu certo, confirma as duas inserções
            await trx.commit();

            return res.status(201).json({ message: `Aluno com matrícula ${matricula} cadastrado com sucesso!` });

        } catch (error) {
            // Se der erro em qualquer uma das tabelas, desfaz tudo
            await trx.rollback();
            console.error("ERRO NO CADASTRO DEFINITIVO:", error.message);

            // Tratamento de duplicidade (Matrícula, E-mail ou CPF)
            if (error.code === '23505') {
                let campoDuplicado = "dado";
                if (error.detail.includes('id')) campoDuplicado = "matrícula";
                if (error.detail.includes('email')) campoDuplicado = "e-mail";
                if (error.detail.includes('cpf')) campoDuplicado = "CPF";
                
                return res.status(400).json({ error: `Este ${campoDuplicado} já está em uso.` });
            }

            return res.status(400).json({ error: 'Erro ao cadastrar: ' + error.message });
        }
    },

    // Lógica de Login (Ajustada para retornar 'matricula')
    async login(req, res) {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
        }

        try {
            const usuario = await connection('usuarios')
                .where('email', email.toLowerCase().trim())
                .first();

            if (!usuario) {
                return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
            }

            const senhaBate = await bcrypt.compare(senha, usuario.senha);

            if (!senhaBate) {
                return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
            }

            const token = jwt.sign(
                { id: usuario.id, tipo: usuario.tipo }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' }
            );

            return res.json({
                usuario: {
                    matricula: usuario.id,
                    nome: usuario.nome,
                    tipo: usuario.tipo,
                    semestre_atual: usuario.semestre_atual
                },
                token: token
            });
        } catch (error) {
            console.error("Erro no login:", error);
            return res.status(500).json({ error: 'Erro interno ao tentar realizar o login.' });
        }
    }
};