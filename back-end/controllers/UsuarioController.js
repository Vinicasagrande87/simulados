const connection = require('../database/connection');
// criando a variavel connection e atribuindo a ela o caminho ate o arquivo responsavel pela 
// conexão com o banco de dados

module.exports = {
// informa que o que estiver dentro dessa chave sera o que vamos conectar com o banco

    // Listar todos os usuários
    async index(req, res) {
// função assincrona usada para listar todos os usuarios cadastrados
        try {
            const usuarios = await connection('usuarios').select('*');
// criando a variavel usuarios e usando await para garantir que a busca no banco termine antes de seguir
// selecionando todas as colunas da tabela 'usuarios'
            return res.json(usuarios);
// retorna a lista de usuarios no formato JSON
        } catch (error) {
            console.error("Erro ao listar usuários:", error);
            return res.status(500).json({ error: 'Erro ao buscar usuários.' });
        }
// caso ocorra erro no servidor, retorna o status 500
    },

    // Criar um novo usuário (Cadastro)
    async create(req, res) {
// função assincrona para cadastrar um novo usuario (aluno ou professor)
        const { nome, email, senha, tipo, semestre_atual } = req.body;
// coletando os dados enviados pelo usuario no corpo da requisição

        try {
            await connection('usuarios').insert({
                nome,
                email,
                senha,
                tipo, // Aqui definimos se é 'aluno' ou 'professor'
                semestre_atual
            });
// inserindo os dados na tabela 'usuarios' do banco de dados

            return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
// retorna status 201 (Criado) e a mensagem de sucesso
        } catch (error) {
            console.error("Erro ao cadastrar usuário:", error);
            return res.status(400).json({ error: 'Erro ao cadastrar usuário. Verifique se o e-mail já existe.' });
        }
// se houver erro (como e-mail duplicado), retorna status 400
    },

    // Lógica de Login
    async login(req, res) {
// função assincrona que valida o acesso do usuario ao sistema
        const { email, senha } = req.body;
// coletando e-mail e senha digitados na tela de login

        try {
            const usuario = await connection('usuarios')
                .where('email', email)
                .first();
// busca na tabela de usuarios o primeiro registro que tenha o e-mail igual ao digitado

            // Se não encontrar o usuario ou a senha estiver incorreta
            if (!usuario || usuario.senha !== senha) {
                return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
            }
// retorna erro 401 (Não autorizado) caso as credenciais estejam erradas

            // Retorna os dados essenciais para o Front-end gerenciar o acesso
            return res.json({
                id: usuario.id,
                nome: usuario.nome,
                tipo: usuario.tipo // Informação crucial para as regras de Aluno vs Professor
            });
// envia os dados do usuario logado para o sistema saber quem ele é e o que pode acessar
        } catch (error) {
            console.error("Erro ao tentar logar:", error);
            return res.status(500).json({ error: 'Erro interno ao tentar realizar o login.' });
        }
// erro 500 caso o servidor ou o banco falhem durante o processo
    }
};