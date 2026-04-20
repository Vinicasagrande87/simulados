const connection = require('../database/connection');
// criando a variavel connection e atribuindo a ela o caminho ate o arquivo responsavel pela 
// conexão com o banco de dados

module.exports = {
// informa que o modolo que esta dentro das chaves fara a conexão com o banco

    // Listar todas as disciplinas
    async index(req, res) {
// função assincrona usada para listar(ler)
        try {
            const disciplinas = await connection('disciplinas').select('*');
// criando uma variavel diciplinas e usando o await para evitar que trave a app
// usando connection('disciplinas') para chegar ate a tabela disciplinas
// e usando o comando .select('*') para selecionar toda a tabela
            return res.json(disciplinas);
// retonar a tabela disciplinas inteira
        } catch (error) {
            console.error("Erro ao listar disciplinas:", error);
            return res.status(500).json({ error: 'Erro ao buscar disciplinas.' });
        }
    }, 

    // Criar nova disciplina
    async create(req, res) {
// função assincrona para criar uma nova disciplina
        const { nome } = req.body;
// pegando a requisição do usuario e preenchendo na coluna nome da tabela disciplinas

        try {
            await connection('disciplinas').insert({ nome });
// await que nos da a segurança do app nao travar devido a sua busca no banco
// connection('disciplinas') usando a variavel connection que tem em si atribuida o arquivo connection
// responsavel pela conexão com o banco e entrando na tabela disciplinas e inserindo .insert({ nome });
// o nome digitado pelo usuario

            return res.status(201).json({ message: 'Disciplina criada!' });
// retorna os status de sucesso com a mensagem disciplina criada!

        } catch (error) {
            console.error("Erro ao criar disciplina:", error);
// o console.error mostra para o desenvolvedor o que quebrou exatamente
            return res.status(500).json({ error: 'Erro ao cadastrar disciplina.' });
// o status 500 avisa ao front-end que o erro foi no servidor (no "nosso lado")
        }
    }
};