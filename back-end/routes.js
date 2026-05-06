const express = require('express');
const routes = express.Router();

// Importação dos Controllers
const UsuarioController = require('./controllers/UsuarioController');
const DisciplinaController = require('./controllers/DisciplinaController');
const QuestaoController = require('./controllers/QuestaoController');
const AlternativaController = require('./controllers/AlternativaController');
const SimuladoController = require('./controllers/SimuladoController');
const SimuladoQuestaoController = require('./controllers/SimuladoQuestaoController');
const HistoricoController = require('./controllers/HistoricoController');
const AlunoController = require('./controllers/AlunoController');
const ProfessorController = require('./controllers/ProfessorController');

const authMiddleware = require('./middlewares/auth');

// --- ROTAS REALMENTE ABERTAS ---
routes.post('/login', UsuarioController.login);

// --- MIDDLEWARE DE IDENTIFICAÇÃO OPCIONAL ---
// Criamos uma função rápida para tentar ler o token se ele existir, mas não barrar se não existir
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return next();
    
    const jwt = require('jsonwebtoken');
    const [, token] = authHeader.split(' ');
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.usuarioId = decoded.id;
        req.usuarioTipo = decoded.tipo;
        next();
    } catch (err) {
        next(); // Se o token for inválido, apenas segue como deslogado
    }
};

// Cadastro de usuário usa o identificador opcional
// Se for admin logado, cria professor. Se não for ninguém, só cria aluno.
routes.post('/usuarios', optionalAuth, UsuarioController.create); 

// --- PROTEÇÃO TOTAL (TUDO ABAIXO EXIGE TOKEN OBRIGATÓRIO) ---
routes.use(authMiddleware);

// --- ROTAS PROTEGIDAS ---

// 1. Usuários
routes.get('/usuarios', UsuarioController.index);

// 2. Perfis
routes.post('/alunos', AlunoController.create);
routes.get('/alunos', AlunoController.index);
routes.post('/professores', ProfessorController.create);
routes.get('/professores', ProfessorController.index);

// 3. Disciplinas
routes.get('/disciplinas', DisciplinaController.index);
routes.post('/disciplinas', DisciplinaController.create);

// 4. Questões
routes.get('/questoes', QuestaoController.index);
routes.post('/questoes', QuestaoController.create);
routes.get('/questoes/:id', QuestaoController.show);
routes.delete('/questoes/:id', QuestaoController.delete);

// 5. Alternativas
routes.get('/questoes/:id_questao/alternativas', AlternativaController.show);
routes.post('/alternativas', AlternativaController.create);

// 6. Simulados
routes.get('/simulados', SimuladoController.index);
routes.post('/simulados', SimuladoController.create);
routes.get('/simulados/:id', SimuladoController.show);

// 7. Vínculo Questões
routes.get('/simulados/:id_simulado/questoes', SimuladoQuestaoController.index);
routes.post('/simulados/questoes', SimuladoQuestaoController.create);

// 8. Histórico e Tentativas
routes.get('/historico', HistoricoController.index);
routes.post('/tentativas', HistoricoController.create);
routes.get('/tentativas/:id', HistoricoController.show);

module.exports = routes;