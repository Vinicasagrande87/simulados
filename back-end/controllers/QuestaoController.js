const connection = require('../database/connection');

module.exports = {
    // Lista todas as questões com o nome da disciplina junto
    async index(req, res) {
        try {
            const questoes = await connection('questoes')
                .join('disciplinas', 'disciplinas.id', '=', 'questoes.id_disciplina')
                .select([
                    'questoes.*', 
                    'disciplinas.nome as disciplina'
                ]);

            return res.json(questoes);
        } catch (error) {
            console.error("Erro ao buscar questões:", error);
            return res.status(500).json({ error: 'Erro interno ao buscar questões.' });
        }
    },

    // Cria uma nova questão
    async create(req, res) {
        const { enunciado, semestre_alvo, id_disciplina, id_professor, explicacao } = req.body;

        try {
            // O Knex retorna um array com os IDs inseridos
            const [id] = await connection('questoes').insert({
                enunciado,
                semestre_alvo,
                id_disciplina,
                id_professor,
                explicacao // Opcional, caso queira guardar o porquê da resposta
            }).returning('id');

            return res.status(201).json({ 
                message: 'Questão cadastrada com sucesso!',
                id 
            });
        } catch (error) {
            console.error("Erro no banco:", error.detail || error.message);
            return res.status(400).json({ 
                error: 'Erro ao cadastrar questão. Verifique se os IDs de disciplina e professor existem.' 
            });
        }
    },

    // Busca uma questão específica (útil para ver alternativas depois)
    async show(req, res) {
        const { id } = req.params;

        try {
            const questao = await connection('questoes')
                .where('id', id)
                .first();

            if (!questao) {
                return res.status(404).json({ error: 'Questão não encontrada.' });
            }

            return res.json(questao);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar questão.' });
        }
    },

    // Deletar questão
    async delete(req, res) {
        const { id } = req.params;

        try {
            await connection('questoes').where('id', id).delete();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar questão.' });
        }
    }
};