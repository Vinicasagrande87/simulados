const connection = require('../database/connection');

module.exports = {
    // Listar todas as disciplinas
    async index(req, res) {
        const disciplinas = await connection('disciplinas').select('*');
        return res.json(disciplinas);
    },

    // Criar nova disciplina
    async create(req, res) {
        const { nome } = req.body;

        await connection('disciplinas').insert({ nome });

        return res.status(201).json({ message: 'Disciplina criada!' });
    }
};