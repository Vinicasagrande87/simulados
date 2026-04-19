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

// --- ROTAS DE USUÁRIO E AUTENTICAÇÃO ---
routes.post('/login', UsuarioController.login);
routes.get('/usuarios', UsuarioController.index);
routes.post('/usuarios', UsuarioController.create);

// --- ROTAS DE DISCIPLINAS ---
routes.get('/disciplinas', DisciplinaController.index);
routes.post('/disciplinas', DisciplinaController.create);

// --- ROTAS DE QUESTÕES ---
routes.get('/questoes', QuestaoController.index);
routes.post('/questoes', QuestaoController.create);

// --- ROTAS DE ALTERNATIVAS ---
routes.get('/questoes/:id_questao/alternativas', AlternativaController.show);
routes.post('/alternativas', AlternativaController.create);

// --- ROTAS DE SIMULADOS ---
routes.get('/simulados', SimuladoController.index);
routes.post('/simulados', SimuladoController.create);
// Rota para o aluno ver o simulado completo (Questões + Alternativas)
routes.get('/simulados/:id', SimuladoController.show);

// --- ROTAS DE VÍNCULO (QUESTÕES DENTRO DOS SIMULADOS) ---
routes.get('/simulados/:id_simulado/questoes', SimuladoQuestaoController.index);
routes.post('/simulados/questoes', SimuladoQuestaoController.create);

// --- ROTAS DE HISTÓRICO ---
routes.post('/historico', HistoricoController.create);

module.exports = routes;