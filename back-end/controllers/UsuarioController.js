const connection = require('../database/connection');
// criando a variavel connection e atribuindo a ela o caminho ate o arquivo responsavel pela 
// conexão com o banco de dados

const bcrypt = require('bcrypt');
// importando a biblioteca bcrypt para criptografia de senhas

const jwt = require('jsonwebtoken');
// importando o JWT para gerar o token de acesso

module.exports = {
// informa que o que estiver dentro dessa chave sera o que vamos conectar com o banco

    // Listar todos os usuários
    async index(req, res) {
// função assincrona usada para listar todos os usuarios cadastrados

        // --- TRAVA DE SEGURANÇA ---
        // Apenas professores podem listar todos os usuários do sistema
        if (req.usuarioTipo !== 'professor') {
            return res.status(403).json({ error: 'Acesso negado. Apenas professores podem listar usuários.' });
        }

        try {
            const usuarios = await connection('usuarios').select('id', 'nome', 'email', 'tipo', 'semestre_atual');
// criando a variavel usuarios e usando await para garantir que a busca no banco termine antes de seguir
// selecionando colunas específicas (evitando enviar a senha criptografada, por segurança)
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
            // Criptografando a senha antes de salvar no banco
            const salt = await bcrypt.genSalt(10);
            const senhaCriptografada = await bcrypt.hash(senha, salt);

            await connection('usuarios').insert({
                nome,
                email,
                senha: senhaCriptografada, // salvando a senha já criptografada
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

    // Lógica de Login com geração de Token JWT
    async login(req, res) {
// função assincrona que valida o acesso do usuario ao sistema
        const { email, senha } = req.body;
// coletando e-mail e senha digitados na tela de login

        try {
            const usuario = await connection('usuarios')
                .where('email', email)
                .first();
// busca na tabela de usuarios o primeiro registro que tenha o e-mail igual ao digitado

            // Verifica se o usuário existe
            if (!usuario) {
                return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
            }

            // Compara a senha digitada com a senha criptografada que está no banco
            const senhaBate = await bcrypt.compare(senha, usuario.senha);

            if (!senhaBate) {
                return res.status(401).json({ error: 'E-mail ou senha inválidos.' });
            }

            // GERANDO O TOKEN DE SEGURANÇA
            // O primeiro parâmetro são os dados que queremos "esconder" no token
            // O segundo é a nossa chave secreta do arquivo .env
            const token = jwt.sign(
                { id: usuario.id, tipo: usuario.tipo }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' } // O token expira em 1 dia
            );

            // Retorna os dados essenciais e o TOKEN para o Front-end
            return res.json({
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    tipo: usuario.tipo,
                    semestre_atual: usuario.semestre_atual
                },
                token: token // O Front-end salvará esse token para provar quem o usuário é
            });
// envia os dados do usuario logado para o sistema saber quem ele é e o que pode acessar
        } catch (error) {
            console.error("Erro ao tentar logar:", error);
            return res.status(500).json({ error: 'Erro interno ao tentar realizar o login.' });
        }
    }
};