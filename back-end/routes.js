console.log(">>> [CONTROLE]: CARREGOU O ARQUIVO DE ROTAS DE 106 LINHAS");
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
const RankingController = require('./controllers/RankingController');
const FeedbackController = require('./controllers/FeedbackController');

const authMiddleware = require('./middlewares/auth');

// --- TRAVA DE SEGURANÇA (BARRAR ALUNO) ---
const checkDocente = (req, res, next) => {
    // O authMiddleware já injetou o usuarioTipo no req
    if (req.usuarioTipo === 'professor' || req.usuarioTipo === 'admin') {
        return next();
    }
    return res.status(403).json({ error: 'Acesso negado. Apenas professores ou admins.' });
};

// --- ROTAS ABERTAS ---
routes.post('/login', UsuarioController.login);

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
        next();
    }
};

routes.post('/usuarios', optionalAuth, UsuarioController.create); 

// --- PROTEÇÃO TOTAL ---
routes.use(authMiddleware);

// --- ROTAS PROTEGIDAS ---

// 1. Usuários
routes.get('/usuarios', UsuarioController.index);
routes.delete('/usuarios/:id', UsuarioController.delete);
routes.post('/admin/cadastrar-professor', UsuarioController.create);

// 2. Ranking
routes.get('/ranking', RankingController.index);

// 3. Feedbacks
routes.post('/feedbacks', FeedbackController.create);
routes.get('/feedbacks', FeedbackController.index);

// 4. Professor - Dashboards (Só Professor/Admin vê)
routes.get('/professor/dashboard-turma', checkDocente, ProfessorController.dashboardTurma);
routes.get('/professor/lista-alunos', checkDocente, ProfessorController.indexAlunos);

// 5. Perfis
routes.post('/alunos', AlunoController.create);
routes.get('/alunos', AlunoController.index);
routes.post('/professores', checkDocente, ProfessorController.create); // Aluno não cria professor
routes.get('/professores', ProfessorController.index);

// 6. Disciplinas
routes.get('/disciplinas', DisciplinaController.index);
routes.post('/disciplinas', checkDocente, DisciplinaController.create); // Aluno não cria disciplina

// 7. Questões (BLINDAGEM AQUI)
routes.get('/questoes', QuestaoController.index); 
routes.post('/questoes', checkDocente, QuestaoController.create); // TRAVADO
routes.get('/questoes/:id', QuestaoController.show);
routes.put('/questoes/:id', checkDocente, QuestaoController.update); // TRAVADO
routes.delete('/questoes/:id', checkDocente, QuestaoController.delete); // TRAVADO

// 8. Alternativas (BLINDAGEM AQUI)
routes.get('/questoes/:id_questao/alternativas', AlternativaController.show);
routes.post('/alternativas', checkDocente, AlternativaController.create); // TRAVADO

// 9. Simulados
routes.get('/simulados', SimuladoController.index);
routes.post('/simulados', checkDocente, SimuladoController.create); // Aluno não cria simulado
routes.get('/simulados/:id', SimuladoController.show);
routes.put('/simulados/:id', checkDocente, SimuladoController.update);

// 10. Vínculo Questões
routes.get('/simulados/:id_simulado/questoes', SimuladoQuestaoController.index);
routes.post('/simulados/questoes', checkDocente, SimuladoQuestaoController.create); // TRAVADO

// 11. Histórico e Tentativas (Liberado para o aluno fazer)
routes.get('/historico', HistoricoController.index);
routes.post('/tentativas', HistoricoController.create);
routes.get('/tentativas/:id', HistoricoController.show);

module.exports = routes;