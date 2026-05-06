const knex = require('../database/connection');

module.exports = {
    // Listar todos os professores
    async index(req, res) {
        try {
            const professores = await knex('professores')
                .join('usuarios', 'usuarios.id', '=', 'professores.usuario_id')
                .select('professores.*', 'usuarios.nome', 'usuarios.email');
            
            return res.json(professores);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar professores' });
        }
    },

    // Criar um perfil de professor
    async create(req, res) {
        const { especialidade, usuario_id } = req.body;

        try {
            // Verifica se o usuário existe
            const usuarioExiste = await knex('usuarios').where('id', usuario_id).first();
            
            if (!usuarioExiste) {
                return res.status(400).json({ error: 'Usuário não encontrado' });
            }

            // Insere na tabela professores
            const [id] = await knex('professores').insert({
                especialidade,
                usuario_id
            }).returning('id');

            return res.status(201).json({ id, especialidade, usuario_id });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ error: 'Erro ao cadastrar perfil de professor' });
        }
    }
};