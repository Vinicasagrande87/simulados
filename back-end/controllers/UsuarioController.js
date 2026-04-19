const connection = require('../database/connection');

module.exports = {
    // Listar todos os usuários
    async index(req, res) {
        try {
            const usuarios = await connection('usuarios').select('*');
            return res.json(usuarios);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar usuários.' });
        }
    },

    // Criar um novo usuário (Cadastro)
    async create(req, res) {
        const { nome, email, senha, tipo, semestre_atual } = req.body;

        try {
            await connection('usuarios').insert({
                nome,
                email,
                senha,
                tipo,
                semestre_atual
            });

            return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ error: 'Erro ao cadastrar usuário.' });
        }
    },

    // Lógica de Login (dentro do UsuarioController)
    async login(req, res) {
        const { email, senha } = req.body;

        try {
            const usuario = await connection('usuarios')
                .where('email', email)
                .first();

            // Se não encontrar ou a senha estiver errada
            if (!usuario || usuario.senha !== senha) {
                return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
            }

            // Retorna os dados para o Front-end salvar na sessão
            return res.json({
                id: usuario.id,
                nome: usuario.nome,
                tipo: usuario.tipo
            });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao tentar logar.' });
        }
    }
};