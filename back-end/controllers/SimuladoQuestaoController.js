const connection = require('../database/connection');

module.exports = {
    // Lista as questões vinculadas a um simulado específico
    async index(req, res) {
        const { id_simulado } = req.params;
        try {
            const questoes = await connection('questoes')
                .join('simulado_questoes', 'questoes.id', '=', 'simulado_questoes.questao_id')
                .where('simulado_questoes.simulado_id', id_simulado)
                .select('questoes.*');
            
            return res.json(questoes);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar questões do simulado.' });
        }
    },

    // VINCULAR QUESTÕES (Corrigido para bater com seu JSON do Insomnia)
    async create(req, res) {
        const { id_simulado, id_questoes } = req.body;

        try {
            // Verifica se é um array para evitar erro 500
            if (!Array.isArray(id_questoes)) {
                return res.status(400).json({ error: "id_questoes precisa ser um array, ex: [4]" });
            }

            // Mapeia os dados para as colunas reais do banco Neon
            const vinculos = id_questoes.map(id_q => ({
                simulado_id: Number(id_simulado),
                questao_id: Number(id_q)
            }));

            await connection('simulado_questoes').insert(vinculos);

            return res.status(201).json({ message: 'Questões vinculadas com sucesso!' });
        } catch (error) {
            console.error("Erro no vínculo:", error.message);
            return res.status(400).json({ 
                error: 'Erro ao vincular questões. Verifique se os IDs existem.',
                details: error.message 
            });
        }
    }
};