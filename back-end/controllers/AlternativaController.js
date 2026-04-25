const connection = require('../database/connection');
// estou criando uma variavel(connection) e estanciando nela as funcionalidades do conection que esta no database

module.exports = {
// inicio da criação do metedo que sera exportado para o banco
    async index(req, res) {
// função assincrona de buscar a lista de alternativas
        const { questao_id } = req.query;
// quando o usuario faz a busca pela questão junto vem as alternativas dessa questão, essa linha faz essa busca
        try {
// try(parecido com uma condicional) tentei algo, se não der mande o outro
            const query = connection('alternativas');
// preparando o caminho de consulta na tabela alternativa
            if (questao_id) {
//validação pra ver se tem algum dado dentro da questão_id da requisição feita pelo usuario
                query.where('questao_id', questao_id);
//eu pego o caminho instanciado na variavel query e falo com o comando where onde (atributo) 
// buscar a informação que esta entre parenteses ('questao_id', questao_id); o primeiro dado 
// é oqual atributo consultar e o segundo dado é pra conferir se o valor digitado pela usuario 
// é o mesmo digitado pelo usuario, ele faz essa consulta ate achar o que seja igual do usuario
            }
            const alternativas = await query.select('*');
// Estou atribuindo à variável 'alternativas' todas as linhas encontradas na tabela.
// O filtro '.where' garante que traremos apenas as alternativas vinculadas ao 'questao_id' 
// enviado pelo usuário. Uso o 'await' porque a consulta ao banco é uma operação 
// assíncrona (demorada) e preciso que o código espere o resultado chegar.
            return res.json(alternativas);
// retorna as alternativas vinculadas a busca da questão buscada pelo usuario
        } catch (error) {
// caso seu servidor de algum problema, o mundo acabe kkkk o sistema devolve esse codigo a seguir
            console.error("Erro ao buscar alternativas:", error);
// mostra qual foi o erro que impediu a aplicação de continuar            
            return res.status(500).json({ error: 'Erro interno ao buscar alternativas.' });
// Define o status HTTP 500 (Erro no Servidor) e envia um objeto JSON com a mensagem 
// que o Front-end (Angular) usará para avisar o usuário que algo deu errado.
        }
    },

    async show(req, res) {
// função assincrona de buscar uma alternativa específica
        const { id_questao } = req.params;
// Estou criando uma variável com os parâmetros enviados pelo usuário 
// e a atribuindo dentro de id_questao.
        try {
// iniciando o tratamento de excessões
            const alternativas = await connection('alternativas')
// estou atribuindo a variavel alternativas a conexão a tabela alternativas do banco einformado 
// que isso pode demorar (await)
                .where('questao_id', id_questao)
// informa onde vamos buscar a informação e só traz o registro igual do id que o usuario pediu
                .select('*');
// seleciona toda a linha do questao_id
            return res.json(alternativas);
// retorna as alternativas vinculadas as questoes pelo fk da tabela alternativas
        } catch (error) {
// mas caso o servidor para ou o mundo acabe ele retorna isso
            console.error("Erro ao buscar alternativas da questão:", error);
// manda mesagem de erro e o error fora das aspas diz o erro exato
            return res.status(500).json({ error: 'Erro ao buscar alternativas.' });
// Define o status HTTP 500 (Erro no Servidor) e envia um objeto JSON com a mensagem 
// que o Front-end (Angular) usará para avisar o usuário que algo deu errado.
        }
    },

    async create(req, res) {
// função assincrona de criar alternativas
        const { texto, e_correta, questao_id } = req.body;
// o usuario professor requerendo a criação de alternativas, criando na tabela alternativa, 
// nos atributos texto,correta e questão id
        try {
//iniciando o tratamento de excessão. se der tudo certo, exemplo servidor ok siga o fluxo
            const [id] = await connection('alternativas').insert({
// criando um array que vai ser atribuido com os atributos abaixo, como tera que ir ao banco tem um away pra 
// não travar a aplicação e a conexão ja esta sendo feito pelo comando connection('alternativas')
                texto,
                e_correta,
                questao_id
//esse são os 3 atributos que iram ser criados e atribuidos ao array id
            }).returning('id');
// retonando o array id ja com os atributos criados

            return res.status(201).json({ 
                message: 'Alternativa cadastrada com sucesso!',
                id 
            });
// status 201(quando deu tudo certo) e retorna uma mensage (alternativa cadastrada com sucesso)
// e manda junto tudo que foi criado com o id fora das aspas
        } catch (error) {
// caso o servidor caia ou aconteça o apocalipse 
            console.error("Erro no banco:", error.detail || error.message);
// mensagem de erro que esta dentro das aspas e o que esta fora entrega o motivo
            return res.status(400).json({ 
                error: 'Erro ao cadastrar alternativa. Verifique os nomes das colunas e se o questao_id existe.' 
            });
// retorna o erro de status 400 e manda a mensagem  'Erro ao cadastrar alternativa. 
// Verifique os nomes das colunas e se o questao_id existe.'
        }
    },

    async delete(req, res) {
// criando função assincrona de deletar
        const { id } = req.params;
// buscando qual função deletar conforme os parametros indicados pelo usuario
        try {
// iniciando tratamento de excessão
            await connection('alternativas').where('id', id).delete();
// await não deixa o sistema travar motivado pela busca no banco que pode ser mais demorada
// a conexão foi feita, usando o arquivo connection para entrar na tabela alternativas
// where('id...) diz qual linha vamos deletar e o id sem as aspas pega o id digitado pelo usuario para fazer
// a busca no banco e o delete() deleta essa alternativa
            return res.status(204).send();
// retorna o sucesso da operação de deletar
        } catch (error) {
// caso o servidor trave 
            console.error("Erro ao deletar alternativa:", error);
            return res.status(500).json({ error: 'Erro ao deletar alternativa.' });
        }
// informar erro ao deletar a alternativa e o error fora das aspas diz o motivo
    }
};