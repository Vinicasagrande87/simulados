const connection = require('../database/connection');

module.exports = {
    async create(req, res) {
        const { id_simulado, respostas } = req.body;
        const id_usuario = req.usuarioId; 

        try {
            // Busca as alternativas corretas apenas para as questões vinculadas a este simulado
            const alternativasCorretas = await connection('alternativas')
                .join('simulado_questoes', 'alternativas.questao_id', '=', 'simulado_questoes.questao_id')
                .where('simulado_questoes.simulado_id', id_simulado)
                .where('alternativas.e_correta', true) 
                .select('alternativas.questao_id', 'alternativas.id as alternativa_id');

            let acertos = 0;

            // Compara as respostas enviadas com o gabarito oficial
            respostas.forEach(resp => {
                const correta = alternativasCorretas.find(alt => alt.questao_id === Number(resp.questao_id));
                if (correta && Number(correta.alternativa_id) === Number(resp.alternativa_id)) {
                    acertos++;
                }
            });

            const total_questoes = alternativasCorretas.length;
            const notaCalculada = total_questoes > 0 ? (acertos / total_questoes) * 10 : 0;

            // Inicia transação para salvar a tentativa e os detalhes das respostas
            const id_tentativa = await connection.transaction(async trx => {
                const [novaTentativa] = await trx('tentativas_simulados').insert({
                    aluno_id: id_usuario,
                    simulado_id: id_simulado,
                    pontuacao: notaCalculada
                }).returning('id');

                const tentativa_id = novaTentativa.id || novaTentativa;

                const detalheRespostas = respostas.map(resp => ({
                    tentativa_id: tentativa_id,
                    questao_id: resp.questao_id,
                    alternativa_escolhida_id: resp.alternativa_id
                }));

                await trx('respostas_tentativas').insert(detalheRespostas);
                return tentativa_id;
            });

            return res.status(201).json({
                message: 'Simulado finalizado!',
                nota: notaCalculada.toFixed(2),
                acertos,
                total: total_questoes,
                tentativa_id: id_tentativa
            });

        } catch (error) {
            console.error("ERRO NO HISTORICO:", error); 
            return res.status(400).json({ 
                error: 'Erro ao salvar resultado.',
                detalhe: error.message 
            });
        }
    },

    async index(req, res) {
        const usuario_id = req.usuarioId;
        const usuario_tipo = req.usuarioTipo;

        try {
            let query = connection('tentativas_simulados')
                .join('simulados', 'simulados.id', '=', 'tentativas_simulados.simulado_id')
                .join('usuarios', 'usuarios.id', '=', 'tentativas_simulados.aluno_id');

            // Filtro: Aluno vê apenas as suas; Professor vê de todos
            if (usuario_tipo === 'aluno') {
                query.where('tentativas_simulados.aluno_id', usuario_id);
            }

            const historico = await query.select([
                'tentativas_simulados.id',
                'usuarios.nome as aluno_nome',
                'simulados.titulo as simulado_titulo',
                'tentativas_simulados.pontuacao',
                'tentativas_simulados.data_conclusao'
            ]).orderBy('tentativas_simulados.data_conclusao', 'desc');

            return res.json(historico);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar histórico.' });
        }
    },

    async show(req, res) {
        const { id } = req.params;
        try {
            const tentativa = await connection('tentativas_simulados')
                .join('simulados', 'simulados.id', '=', 'tentativas_simulados.simulado_id')
                .where('tentativas_simulados.id', id)
                .select('tentativas_simulados.*', 'simulados.titulo')
                .first();

            if (!tentativa) return res.status(404).json({ error: "Registro não encontrado." });

            const questoes = await connection('respostas_tentativas')
                .join('questoes', 'questoes.id', '=', 'respostas_tentativas.questao_id')
                .where('respostas_tentativas.tentativa_id', id)
                .select('questoes.*', 'respostas_tentativas.alternativa_escolhida_id');

            const revisao = await Promise.all(questoes.map(async q => {
                const alternativas = await connection('alternativas')
                    .where('questao_id', q.id)
                    .select('id', 'texto', 'e_correta'); 
                return { ...q, alternativas };
            }));

            return res.json({ ...tentativa, questoes: revisao });
        } catch (error) {
            return res.status(500).json({ error: "Erro ao carregar detalhes da tentativa." });
        }
    }
};