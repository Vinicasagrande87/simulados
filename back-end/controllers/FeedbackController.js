const connection = require('../database/connection');

module.exports = {
    // Esta única função atende as duas pétalas (Suporte e Sugestão)
    async create(req, res) {
        const { assunto, mensagem, tipo } = req.body;
        const usuario_id = req.usuarioId; // Pego automaticamente do token

        // Validação simples
        if (!assunto || !mensagem || !tipo) {
            return res.status(400).json({ error: 'Preencha todos os campos corretamente.' });
        }

        try {
            await connection('feedbacks').insert({
                usuario_id,
                tipo, // Aqui o banco salva se é 'suporte' ou 'sugestao'
                assunto,
                mensagem
            });

            return res.status(201).json({ message: 'Sua mensagem foi enviada com sucesso!' });
        } catch (error) {
            console.error('>>> [ERRO FEEDBACK]:', error.message);
            return res.status(500).json({ error: 'Erro ao processar sua solicitação.' });
        }
    },

    // Para o Admin ou Professor verem a lista completa
    async index(req, res) {
        try {
            const feedbacks = await connection('feedbacks')
                .join('usuarios', 'usuarios.id', '=', 'feedbacks.usuario_id')
                .select([
                    'feedbacks.*',
                    'usuarios.nome',
                    'usuarios.email'
                ])
                .orderBy('feedbacks.criado_em', 'desc');

            return res.json(feedbacks);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar os feedbacks.' });
        }
    }
};