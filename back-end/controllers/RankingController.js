const connection = require('../database/connection');

module.exports = {
    // Retorna a lista ordenada para o Front-end (Pétala de Ranking)
    async index(req, res) {
        try {
            const ranking = await connection('rankings')
                .join('usuarios', 'usuarios.id', '=', 'rankings.usuario_id')
                .select([
                    'usuarios.nome',
                    'rankings.pontos_totais',
                    'rankings.simulados_concluidos',
                    'rankings.total_acertos'
                ])
                .orderBy('rankings.pontos_totais', 'desc')
                .limit(10); // Mostra o Top 10

            return res.json(ranking);
        } catch (error) {
            console.error('>>> [ERRO NO RANKING]:', error.message);
            return res.status(500).json({ error: 'Erro ao carregar ranking.' });
        }
    },

    // Esta função será usada internamente no futuro para atualizar os pontos
    async atualizarPontos(usuario_id, pontosGanhos, acertosGanhos) {
        try {
            const registro = await connection('rankings').where({ usuario_id }).first();

            if (registro) {
                await connection('rankings')
                    .where({ usuario_id })
                    .update({
                        pontos_totais: registro.pontos_totais + pontosGanhos,
                        simulados_concluidos: registro.simulados_concluidos + 1,
                        total_acertos: registro.total_acertos + acertosGanhos
                    });
            } else {
                await connection('rankings').insert({
                    usuario_id,
                    pontos_totais: pontosGanhos,
                    simulados_concluidos: 1,
                    total_acertos: acertosGanhos
                });
            }
        } catch (error) {
            console.error('>>> [ERRO AO ATUALIZAR RANKING]:', error.message);
        }
    }
};