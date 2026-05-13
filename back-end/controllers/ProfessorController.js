const knex = require('../database/connection');

module.exports = {
    // 1. Listar todos os professores (Seu original)
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

    // 2. Criar um perfil de professor (Seu original)
    async create(req, res) {
        const { especialidade, usuario_id } = req.body;

        try {
            const usuarioExiste = await knex('usuarios').where('id', usuario_id).first();
            
            if (!usuarioExiste) {
                return res.status(400).json({ error: 'Usuário não encontrado' });
            }

            const [result] = await knex('professores').insert({
                especialidade,
                usuario_id
            }).returning('id');

            const id_gerado = result.id || result;

            return res.status(201).json({ id: id_gerado, especialidade, usuario_id });
        } catch (error) {
            console.error(error);
            return res.status(400).json({ error: 'Erro ao cadastrar perfil de professor' });
        }
    },

    // --- NOVAS PÉTALAS DO PROFESSOR (VISÃO DA TURMA) ---

    // 3. Pétala: Histórico da Turma (Mostra apenas a ÚLTIMA tentativa de cada aluno por simulado)
    async dashboardTurma(req, res) {
        try {
            // Subquery para encontrar a data da última tentativa de cada aluno em cada simulado
            const subquery = knex('tentativas')
                .select('usuario_id', 'simulado_id')
                .max('criado_em as ultima_data')
                .groupBy('usuario_id', 'simulado_id');

            const desempenho = await knex('tentativas')
                .join('usuarios', 'usuarios.id', '=', 'tentativas.usuario_id')
                .join('simulados', 'simulados.id', '=', 'tentativas.simulado_id')
                .joinRaw(`INNER JOIN (${subquery.toString()}) as ultimas 
                          ON tentativas.usuario_id = ultimas.usuario_id 
                          AND tentativas.simulado_id = ultimas.simulado_id 
                          AND tentativas.criado_em = ultimas.ultima_data`)
                .select([
                    'usuarios.nome as aluno_nome',
                    'simulados.titulo as simulado_titulo',
                    'tentativas.pontuacao',
                    'tentativas.total_questoes',
                    'tentativas.criado_em as data_tentativa'
                ])
                .orderBy('tentativas.criado_em', 'desc');

            return res.json(desempenho);
        } catch (error) {
            console.error('>>> [ERRO DASHBOARD PROFESSOR]:', error.message);
            return res.status(500).json({ error: 'Erro ao buscar desempenho da turma.' });
        }
    },

    // 4. Listar todos os alunos cadastrados para o professor conhecer a turma
    async indexAlunos(req, res) {
        try {
            const alunos = await knex('alunos')
                .join('usuarios', 'usuarios.id', '=', 'alunos.usuario_id')
                .select([
                    'usuarios.nome',
                    'usuarios.email',
                    'alunos.curso',
                    'alunos.semestre'
                ]);
            return res.json(alunos);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao listar alunos.' });
        }
    }
};