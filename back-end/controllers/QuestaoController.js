const connection = require('../database/connection');

module.exports = {
    async index(req, res) {
        const semestre_do_aluno = req.usuarioSemestre; 
        const usuario_tipo = req.usuarioTipo;

        try {
            let query = connection('questoes')
                .join('disciplinas', 'disciplinas.id', '=', 'questoes.id_disciplina')
                .select([
                    'questoes.*', 
                    'disciplinas.nome as disciplina_nome',
                    'disciplinas.semestre as disciplina_semestre'
                ]);

            if (usuario_tipo === 'aluno') {
                query.where('disciplinas.semestre', '=', semestre_do_aluno);
            }

            const questoes = await query;
            return res.json(questoes);
        } catch (error) {
            console.error("Erro ao buscar questões:", error);
            return res.status(500).json({ error: 'Erro interno ao buscar questões.' });
        }
    },

    async create(req, res) {
        const { enunciado, semestre_alvo, id_disciplina, explicacao } = req.body;
        const id_professor_logado = req.usuarioId; 

        try {
            const [result] = await connection('questoes').insert({
                enunciado,
                semestre_alvo: semestre_alvo || 1,
                id_disciplina: Number(id_disciplina),
                id_professor: id_professor_logado, 
                explicacao 
            }).returning('id');

            const id_gerado = result.id || result;

            return res.status(201).json({ 
                message: 'Questão cadastrada com sucesso!',
                id: id_gerado 
            });
        } catch (error) {
            return res.status(400).json({ 
                error: 'Erro ao cadastrar questão.',
                detalhe: error.message 
            });
        }
    },

    async show(req, res) {
        const { id } = req.params;
        const usuario_tipo = req.usuarioTipo; 
        const semestre_do_aluno = req.usuarioSemestre;

        try {
            const questao = await connection('questoes')
                .join('disciplinas', 'disciplinas.id', '=', 'questoes.id_disciplina')
                .where('questoes.id', id)
                .select('questoes.*', 'disciplinas.semestre as disciplina_semestre')
                .first();

            if (!questao) {
                return res.status(404).json({ error: 'Questão não encontrada.' });
            }

            if (usuario_tipo === 'aluno' && questao.disciplina_semestre !== semestre_do_aluno) {
                return res.status(403).json({ error: 'Acesso negado: Esta questão pertence a outro semestre.' });
            }

            if (usuario_tipo === 'aluno') {
                delete questao.explicacao;
            }

            return res.json(questao);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar questão.' });
        }
    },

    // NOVO: Método para Alterar Questão (Pétala 3 do Professor)
    async update(req, res) {
        const { id } = req.params;
        const { enunciado, semestre_alvo, id_disciplina, explicacao } = req.body;
        const id_professor_logado = req.usuarioId;
        const usuario_tipo = req.usuarioTipo;

        try {
            const questao = await connection('questoes').where('id', id).first();

            if (!questao) {
                return res.status(404).json({ error: 'Questão não encontrada.' });
            }

            // Trava de segurança: apenas o dono ou admin edita
            if (questao.id_professor !== id_professor_logado && usuario_tipo !== 'admin') {
                return res.status(401).json({ error: 'Sem permissão para alterar esta questão.' });
            }

            await connection('questoes')
                .where('id', id)
                .update({
                    enunciado,
                    semestre_alvo,
                    id_disciplina,
                    explicacao
                });

            return res.json({ message: 'Questão atualizada com sucesso!' });
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao atualizar questão.' });
        }
    },

    async delete(req, res) {
        const { id } = req.params;
        const id_professor_logado = req.usuarioId;
        const usuario_tipo = req.usuarioTipo;

        try {
            const questao = await connection('questoes').where('id', id).first();
            
            if (!questao) {
                return res.status(404).json({ error: 'Questão não existe.' });
            }

            if (questao.id_professor !== id_professor_logado && usuario_tipo !== 'admin') {
                return res.status(401).json({ error: 'Sem permissão para deletar.' });
            }

            await connection('questoes').where('id', id).delete();
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar questão.' });
        }
    }
};