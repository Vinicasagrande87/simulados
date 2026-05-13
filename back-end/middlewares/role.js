module.exports = {
    // Bloqueia quem não é Professor ou Admin
    isDocente: (req, res, next) => {
        const { usuarioTipo } = req;

        if (usuarioTipo === 'professor' || usuarioTipo === 'admin') {
            return next();
        }

        return res.status(403).json({ 
            error: 'Acesso negado. Apenas professores ou admins podem realizar esta operação.' 
        });
    }
};