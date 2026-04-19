const connection = require('../database/connection');

module.exports = {
    async create(req, res) {
        const { simulado_id, questao_id } = req.body;

        try {
            // Removendo o .returning('id') para evitar o erro de coluna inexistente
            await connection('simulado_questoes').insert({
                simulado_id,
                questao_id
            });

            return res.status(201).json({ 
                message: 'Questão vinculada ao simulado com sucesso!'
            });
        } catch (error) {
            console.error("Erro ao vincular questão:", error.message);
            return res.status(400).json({ 
                error: 'Erro ao vincular questão. Verifique se os IDs existem.',
                details: error.message 
            });
        }
    },

    async index(req, res) {
        const { id_simulado } = req.params;

        try {
            const questoes = await connection('simulado_questoes')
                .where('simulado_id', id_simulado)
                .join('questoes', 'questoes.id', '=', 'simulado_questoes.questao_id')
                .select('questoes.*');

            return res.json(questoes);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar questões.' });
        }
    }
};