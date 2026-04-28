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

const authMiddleware = require('./middlewares/auth');
// Importando o middleware de autenticação (o nosso porteiro)

// --- ROTAS ABERTAS (Não precisam de token) ---

routes.post('/login', UsuarioController.login);
// rota para realizar o login e receber o token JWT

routes.post('/usuarios', UsuarioController.create);
// rota para cadastrar um novo usuario (Aqui o sistema forçará como 'aluno')

// --- PROTEÇÃO ---
// A partir desta linha, o sistema vai exigir o token para qualquer rota abaixo
routes.use(authMiddleware);

// --- ROTAS PROTEGIDAS (Exigem o token no cabeçalho da requisição) ---

// --- ROTA EXCLUSIVA DE ADMIN ---
// Esta rota permite cadastrar professores. Ela verifica se o seu tipo é 'admin' antes de chamar o controller.
routes.post('/admin/cadastrar-professor', (req, res, next) => {
    if (req.usuarioTipo !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Rota exclusiva para o administrador.' });
    }
    next();
}, UsuarioController.create);

// --- ROTAS DE USUÁRIO ---
routes.get('/usuarios', UsuarioController.index);

// --- ROTAS DE DISCIPLINAS ---
routes.get('/disciplinas', DisciplinaController.index);
routes.post('/disciplinas', DisciplinaController.create);

// --- ROTAS DE QUESTÕES ---
routes.get('/questoes', QuestaoController.index);
routes.post('/questoes', QuestaoController.create);
routes.get('/questoes/:id', QuestaoController.show); // ADICIONADO: Para ver detalhes de uma questão
routes.delete('/questoes/:id', QuestaoController.delete); // ADICIONADO: Para o professor poder excluir questão

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
routes.get('/historico', HistoricoController.index); // ADICIONADO: Para listar o histórico (Notas)
routes.post('/historico', HistoricoController.create);

module.exports = routes;