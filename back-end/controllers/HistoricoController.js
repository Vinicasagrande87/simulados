const connection = require('../database/connection');

module.exports = {
    async create(req, res) {
        // Recebemos os dados brutos do Front-end/Thunder Client
        const { id_usuario, id_simulado, acertos, total_questoes } = req.body;

        try {
            // Cálculo da nota (Regra de 3 simples para chegar na nota de 0 a 10)
            const notaCalculada = (acertos / total_questoes) * 10;

            // Inserimos usando os nomes exatos da sua migration
            await connection('historico_tentativas').insert({
                aluno_id: id_usuario,       // na sua migration é aluno_id
                simulado_id: id_simulado,   // na sua migration é simulado_id
                nota: notaCalculada         // na sua migration é nota
            });

            return res.status(201).json({ 
                message: 'Resultado salvo com sucesso!',
                nota: notaCalculada.toFixed(2)
            });
            
        } catch (error) {
            console.error("ERRO NO HISTÓRICO:", error.message);
            return res.status(400).json({ 
                error: 'Erro ao salvar resultado no banco.',
                details: error.message 
            });
        }
    },

    async index(req, res) {
        try {
            const historico = await connection('historico_tentativas')
                .join('simulados', 'simulados.id', '=', 'historico_tentativas.simulado_id')
                .join('usuarios', 'usuarios.id', '=', 'historico_tentativas.aluno_id')
                .select([
                    'historico_tentativas.id',
                    'usuarios.nome as aluno_nome',
                    'simulados.titulo as simulado_titulo',
                    'historico_tentativas.nota',
                    'historico_tentativas.data_realizacao'
                ])
                .orderBy('data_realizacao', 'desc');
            
            return res.json(historico);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar histórico.' });
        }
    }
};