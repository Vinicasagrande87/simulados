const connection = require('../database/connection');

module.exports = {
    async index(req, res) {
        const { questao_id } = req.query;
        try {
            const query = connection('alternativas');
            if (questao_id) {
                query.where('questao_id', questao_id);
            }
            const alternativas = await query.select('*');
            return res.json(alternativas);
        } catch (error) {
            console.error("Erro ao buscar alternativas:", error);
            return res.status(500).json({ error: 'Erro interno ao buscar alternativas.' });
        }
    },

    async show(req, res) {
        const { id_questao } = req.params;
        try {
            const alternativas = await connection('alternativas')
                .where('questao_id', id_questao)
                .select('*');
            return res.json(alternativas);
        } catch (error) {
            console.error("Erro ao buscar alternativas da questão:", error);
            return res.status(500).json({ error: 'Erro ao buscar alternativas.' });
        }
    },

    async create(req, res) {
        const data = req.body;

        try {
            // Se o usuário enviar um ARRAY de alternativas (como você fez no Insomnia)
            if (Array.isArray(data)) {
                const alternativasFormatadas = data.map(item => ({
                    texto: item.texto,
                    e_correta: item.is_correta,
                    questao_id: Number(item.id_questao)
                }));

                await connection('alternativas').insert(alternativasFormatadas);

                return res.status(201).json({ 
                    message: `${alternativasFormatadas.length} Alternativas cadastradas com sucesso!` 
                });
            } 

            // Se o usuário enviar apenas UMA alternativa (objeto único)
            const { texto, is_correta, id_questao } = data;
            const [result] = await connection('alternativas').insert({
                texto,
                e_correta: is_correta,
                questao_id: Number(id_questao)
            }).returning('id');

            const id_gerado = result.id || result;

            return res.status(201).json({ 
                message: 'Alternativa cadastrada com sucesso!',
                id: id_gerado 
            });

        } catch (error) {
            console.error("Erro no banco:", error.detail || error.message);
            return res.status(400).json({ 
                error: 'Erro ao cadastrar alternativa. Verifique se o id_questao existe.',
                detalhe: error.message
            });
        }
    },

    async delete(req, res) {
        const { id } = req.params;
        try {
            await connection('alternativas').where('id', id).delete();
            return res.status(204).send();
        } catch (error) {
            console.error("Erro ao deletar alternativa:", error);
            return res.status(500).json({ error: 'Erro ao deletar alternativa.' });
        }
    }
};