const connection = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    // Listar todos os usuários
    async index(req, res) {
        if (req.usuarioTipo !== 'professor' && req.usuarioTipo !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado. Apenas professores ou admin podem listar usuários.' });
        }

        try {
            const usuarios = await connection('usuarios').select('id', 'nome', 'email', 'tipo', 'semestre_atual');
            return res.json(usuarios);
        } catch (error) {
            console.error("Erro ao listar usuários:", error);
            return res.status(500).json({ error: 'Erro ao buscar usuários.' });
        }
    },

    // Criar um novo usuário
    async create(req, res) {
        const { nome, nomeCompleto, email, senha, tipo, semestre_atual } = req.body;
        const nomeFinal = nome || nomeCompleto;

        // Validação básica de segurança
        if (!nomeFinal || !email || !senha) {
            return res.status(400).json({ error: 'Dados incompletos. Nome, e-mail e senha são obrigatórios.' });
        }

        try {
            // Lógica de definição de tipo
            let tipoFinal = 'aluno';
            if (req.usuarioId && req.usuarioTipo === 'admin') {
                tipoFinal = tipo || 'aluno';
            } else if (tipo === 'professor') {
                return res.status(403).json({ error: 'Acesso negado. Somente administradores criam professores.' });
            }

            // Criptografia
            const salt = await bcrypt.genSalt(10);
            const senhaCriptografada = await bcrypt.hash(senha, salt);

            // Inserção tratada
            await connection('usuarios').insert({
                nome: nomeFinal,
                email: email.toLowerCase().trim(), // Evita erros de digitação e duplicidade boba
                senha: senhaCriptografada,
                tipo: tipoFinal,
                // TRATAMENTO CRÍTICO: Se for vazio ou não for número, vira null para o banco aceitar
                semestre_atual: (semestre_atual && !isNaN(semestre_atual)) ? parseInt(semestre_atual) : null
            });

            return res.status(201).json({ message: `Usuário (${tipoFinal}) cadastrado com sucesso!` });

        } catch (error) {
            // Log detalhado no terminal do Render para sabermos EXATAMENTE o que o banco disse
            console.error("ERRO REAL DO BANCO:", error);

            // Tratamento específico de e-mail duplicado (Código 23505 no Postgres)
            if (error.code === '23505') {
                return res.status(400).json({ error: 'Este e-mail já está em uso.' });
            }

            return res.status(400).json({ error: 'Erro ao cadastrar. Verifique os dados ou tente outro e-mail.' });
        }
    },

    // Lógica de Login
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
                    id: usuario.id,
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