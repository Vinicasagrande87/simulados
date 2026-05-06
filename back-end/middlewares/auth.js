const jwt = require('jsonwebtoken');
const connection = require('../database/connection');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ error: 'Erro no formato do token.' });
    }

    const [scheme, token] = parts;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Buscamos os dados atualizados do usuário no banco para garantir a trava de semestre
        const usuario = await connection('usuarios')
            .where('id', decoded.id)
            .select('tipo', 'semestre_atual')
            .first();

        if (!usuario) {
            return res.status(401).json({ error: 'Usuário não encontrado.' });
        }

        // Injeta os dados necessários na requisição para os Controllers usarem
        req.usuarioId = decoded.id;
        req.usuarioTipo = usuario.tipo; 
        req.usuarioSemestre = usuario.semestre_atual; // Habilita a trava de semestre vigente

        console.log(`>>> AUTH: Usuário ${decoded.id} no semestre [${usuario.semestre_atual}]`);
        return next();
    } catch (err) {
        console.error("Erro na verificação do JWT:", err.message);
        return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
};