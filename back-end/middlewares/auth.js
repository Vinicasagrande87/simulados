const jwt = require('jsonwebtoken');
// importando o JWT para verificar a validade do token

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // capturando o cabeçalho de autorização da requisição

    if (!authHeader) {
        return res.status(401).json({ error: 'Token não fornecido.' });
    }
    // se não houver cabeçalho, retorna erro 401 (Não autorizado)

    const parts = authHeader.split(' ');
    // divide o cabeçalho em duas partes (Bearer e o Token)

    if (parts.length !== 2) {
        return res.status(401).json({ error: 'Erro no token.' });
    }
    // verifica se o formato tem exatamente as duas partes esperadas

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: 'Token malformado.' });
    }
    // verifica se a primeira parte é a palavra 'Bearer'

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Token inválido.' });
        }
        // verifica se o token é válido usando a chave secreta do .env

        // --- IMPORTANTE PARA A TRAVA DE ADMIN ---
        // Salvamos o ID e o TIPO (admin, professor, aluno) extraídos do token
        // para que as rotas e controllers saibam quem está fazendo a requisição
        req.usuarioId = decoded.id;
        req.usuarioTipo = decoded.tipo; 

        return next();
        // libera a requisição para seguir para a próxima rota
    });
};