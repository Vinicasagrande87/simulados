const connection = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { enviarEmailBoasVindas } = require('../services/mailService');

module.exports = {
    async index(req, res) {
        if (req.usuarioTipo !== 'professor' && req.usuarioTipo !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado.' });
        }
        try {
            const usuarios = await connection('usuarios')
                .select('id as matricula', 'nome', 'email', 'tipo', 'semestre_atual');
            return res.json(usuarios);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar usuários.' });
        }
    },

    async create(req, res) {
        // Pegamos todas as variações possíveis que o seu Front-end pode enviar
        const { 
            matricula, 
            nome, nome_completo, 
            email, email_institucional, 
            senha, senha_inicial, 
            tipo, semestre_atual, curso, especialidade 
        } = req.body;

        // --- LÓGICA DE TRATAMENTO DE DADOS (PONTE FRONT-BACK) ---
        const final_nome = nome || nome_completo;
        const final_email = email || email_institucional;
        const final_senha = senha || senha_inicial;
        
        // Se a matrícula não vier, geramos um número único baseado no tempo para não travar o banco
        const final_matricula = matricula || Math.floor(Date.now() / 1000); 
        
        // Definimos o tipo padrão como aluno
        let final_tipo = tipo || 'aluno';
        
        // --- TRAVA DE SEGURANÇA (O CORAÇÃO DA MUDANÇA) ---
        // Se o tipo solicitado for admin ou professor, verificamos se quem está logado é admin
        if (final_tipo === 'admin' || final_tipo === 'professor') {
            // Se o usuário não estiver logado ou não for admin, bloqueamos
            if (req.usuarioTipo !== 'admin') {
                return res.status(403).json({ 
                    error: 'Acesso negado. Apenas administradores podem cadastrar usuários de nível superior.' 
                });
            }
        }

        // Verificação mínima para evitar erro 400
        if (!final_nome || !final_email || !final_senha) {
            return res.status(400).json({ 
                error: 'Dados obrigatórios ausentes.',
                detalhes: { 
                    nome: !!final_nome, 
                    email: !!final_email, 
                    senha: !!final_senha 
                }
            });
        }

        const trx = await connection.transaction();

        try {
            const salt = await bcrypt.genSalt(10);
            const senhaCriptografada = await bcrypt.hash(final_senha, salt);

            // 1. Inserir na tabela 'usuarios'
            await trx('usuarios').insert({
                id: final_matricula, 
                nome: final_nome,
                email: final_email.toLowerCase().trim(),
                senha: senhaCriptografada,
                tipo: final_tipo,
                semestre_atual: (semestre_atual && !isNaN(semestre_atual)) ? parseInt(semestre_atual) : 1
            });

            // 2. Inserir na tabela específica (professores ou alunos)
            if (final_tipo === 'professor') {
                await trx('professores').insert({
                    usuario_id: final_matricula,
                    especialidade: especialidade || 'Geral'
                });
            } else if (final_tipo === 'aluno') {
                await trx('alunos').insert({
                    usuario_id: final_matricula,
                    curso: curso || 'Análise e Desenvolvimento de Sistemas',
                    semestre: (semestre_atual && !isNaN(semestre_atual)) ? parseInt(semestre_atual) : 1
                });
            }

            await trx.commit();

            // 3. Envio do e-mail de Boas-Vindas
            try {
                await enviarEmailBoasVindas(final_email.toLowerCase().trim(), final_nome, final_senha);
            } catch (mailError) {
                console.error('>>> [AVISO]: O cadastro funcionou, mas o e-mail falhou:', mailError.message);
            }

            return res.status(201).json({ 
                message: `Sucesso! Usuário ${final_nome} cadastrado.` 
            });

        } catch (error) {
            if (trx) await trx.rollback();
            console.error('>>> [ERRO NO BANCO]:', error.message);
            return res.status(400).json({ error: 'Erro ao salvar no banco: ' + error.message });
        }
    },

    async delete(req, res) {
        const { id } = req.params;
        try {
            const trx = await connection.transaction();
            try {
                await trx('alunos').where('usuario_id', id).delete();
                await trx('professores').where('usuario_id', id).delete();
                const deletado = await trx('usuarios').where('id', id).delete();
                
                if (!deletado) {
                    await trx.rollback();
                    return res.status(404).json({ error: 'Usuário não encontrado.' });
                }
                
                await trx.commit();
                return res.status(204).send();
            } catch (err) {
                await trx.rollback();
                throw err;
            }
        } catch (error) {
            console.error('ERRO AO DELETAR:', error.message);
            return res.status(500).json({ error: 'Erro ao deletar usuário.' });
        }
    },

    async login(req, res) {
        const { email, senha } = req.body;
        console.log(`\n--- NOVA TENTATIVA DE LOGIN ---`);
        console.log(`Email recebido: [${email}]`);

        try {
            const usuario = await connection('usuarios')
                .where('email', email.toLowerCase().trim())
                .first();

            if (!usuario) {
                console.log(`ERRO: Usuário não encontrado no banco com o email: ${email}`);
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            console.log(`Usuário encontrado: ${usuario.nome} (Tipo: ${usuario.tipo})`);

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                console.log(`ERRO: Senha incorreta para o usuário: ${email}`);
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            const token = jwt.sign(
                { id: usuario.id, tipo: usuario.tipo }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' }
            );

            console.log(`SUCESSO: Login realizado e token gerado!`);

            return res.json({
                usuario: { matricula: usuario.id, nome: usuario.nome, tipo: usuario.tipo },
                token
            });
        } catch (error) {
            console.error('ERRO INTERNO NO LOGIN:', error.message);
            return res.status(500).json({ error: 'Erro interno no servidor.' });
        }
    }
};