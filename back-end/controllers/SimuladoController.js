const connection = require('../database/connection');

module.exports = {
    async create(req, res) {
        const { titulo, semestre_referencia, curso } = req.body;
        const professor_id = req.usuarioId; 

        try {
            const [simulado] = await connection('simulados').insert({
                titulo,
                semestre_referencia,
                curso, 
                professor_id
            }).returning('*');

            return res.status(201).json({ 
                message: 'Simulado criado com sucesso!',
                simulado 
            });
        } catch (error) {
            return res.status(400).json({ error: 'Erro ao criar simulado.' });
        }
    },

    async index(req, res) {
        const usuario_id = req.usuarioId;

        try {
            const aluno = await connection('alunos')
                .where('usuario_id', usuario_id)
                .first();

            if (aluno) {
                // CORREÇÃO: Usando 'aluno.semestre' para bater com a migration 'alunos'
                const simulados = await connection('simulados')
                    .where({
                        curso: aluno.curso,
                        semestre_referencia: aluno.semestre
                    })
                    .select('*');
                return res.json(simulados);
            }

            const simulados = await connection('simulados').select('*');
            return res.json(simulados);

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar simulados.' });
        }
    },

    async show(req, res) {
        const { id } = req.params;
        try {
            const simulado = await connection('simulados').where('id', id).first();
            
            if (!simulado) {
                return res.status(404).json({ error: 'Simulado não encontrado.' });
            }

            const questoes = await connection('questoes')
                .join('simulado_questoes', 'questoes.id', '=', 'simulado_questoes.questao_id')
                .where('simulado_questoes.simulado_id', id)
                .select('questoes.*');

            const questoesComAlternativas = await Promise.all(
                questoes.map(async (questao) => {
                    const alternativas = await connection('alternativas')
                        .where('questao_id', questao.id)
                        .select('id', 'texto', 'e_correta'); 
                    
                    return { ...questao, alternativas };
                })
            );

            return res.json({ 
                ...simulado, 
                questoes: questoesComAlternativas 
            });

        } catch (error) {
            return res.status(500).json({ error: 'Erro ao carregar detalhes.' });
        }
    }
};