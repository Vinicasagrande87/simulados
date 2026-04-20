const connection = require('../database/connection');
// criando uma variavel com o nome connection e atribuindo a ela o acesso ate o arquivo connection

module.exports = {
//função que informa que tudo que estiver dentro das chaves sera usado para fazer a conexão com o banco  

    async index(req, res) {
// criando uma função assincrona para listar(ler)
        try {
// iniciando um tratamento de excessão 
            const questoes = await connection('questoes')
// criando uma variavel questoes e atribuindo a ela a conexão com a tabela questoes
// e usando await para não deixar que o sistema trave
                .join('disciplinas', 'disciplinas.id', '=', 'questoes.id_disciplina')
// usando join para crusar as informações da tabela disciplina/ coluna diciplinas_id e 
// buscando as informações da coluna id_diciplinas que pertence a tabela questoes
                .select([
                    'questoes.*', 
                    'disciplinas.nome as disciplina'
                ]);
// aqui estou fazendo o filtro do que realmente quero do join que fiz
//quero toda a tabela questoes e a coluna nome da tabela disciplinas

            return res.json(questoes);
// me retorma no formato json as questoes requisitadas pelo usuario
        } catch (error) {
// caso de algo problema no servidor 
            console.error("Erro ao buscar questões:", error);
            return res.status(500).json({ error: 'Erro interno ao buscar questões.' });
        }
// mensagem de erro para não deixar o usuario sem nenhuma informação
    },

    // Cria uma nova questão
    async create(req, res) {
// iniciando uma função assincrona de craição de questão
        const { enunciado, semestre_alvo, id_disciplina, id_professor, explicacao } = req.body;
// guardando a requisição do usuario dentro da colunas acima descritas da tabela questao

        try {
// tratamento de excessão
            // O Knex retorna um array com os IDs inseridos
            const [id] = await connection('questoes').insert({
// criando um array id e inserindo os dados fornecidos pelo usuario nas seguinte colunas
                enunciado,
                semestre_alvo,
                id_disciplina,
                id_professor,
                explicacao // Opcional, caso queira guardar o porquê da resposta
            }).returning('id');
// retonando o id com os array ao usuario

            return res.status(201).json({ 
                message: 'Questão cadastrada com sucesso!',
                id 
            });
// retornando status 201 e informando que questão foi cadastrada com sucesso e mandando tudo que
//o usuario cadastrou nessa criação
        } catch (error) {
// mas caso de algo errado como o servidor para ele manda isso 
            console.error("Erro no banco:", error.detail || error.message);
            return res.status(400).json({ 
                error: 'Erro ao cadastrar questão. Verifique se os IDs de disciplina e professor existem.' 
            });
//retorna erro 400 e detalha qual foi o erro 
        }
    },

    // Busca uma questão específica (útil para ver alternativas depois)
    async show(req, res) {
//função assincrona de buscar uma alternativa específica
        const { id } = req.params;
        const { usuario_tipo } = req.query; 
// recebendo a requisição do usuario e filtrando seus parametros 

        try {
// tratamento de excessao
            let query = connection('questoes').where('id', id).first();
// criando variavel conexao e atribuindo a ela a tabela questoes, usando o connection para fazer a ponte e
// await para impedir que o app trave por ir buscar esse informação no banco
// o primeiro 'id' se refere a procura que o sistema faz a essa coluna
//o segundo id faz a comparação do id dado pelo usuario com os id da tabela id
// O .first() extrai a questão de dentro do array. 

            const questao = await query;

            if (!questao) {
// condicional, se requisição for diferente das questoes que ja temos cadastrada
                return res.status(404).json({ error: 'Questão não encontrada.' });
            }

            // REGRA DE NEGÓCIO: Se for ALUNO e ele ainda estiver fazendo a prova,
            // removemos a explicação para ele não ver a resposta antes da hora.
            if (usuario_tipo === 'aluno') {
                delete questao.explicacao;
            }

            return res.json(questao);
//se a requisição for valida com o que temos no banco ele retorna o que foi pedido pelo usuario
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar questão.' });
        }
// retorna o erro caso o servidor de pau 
    },

    // Deletar questão
    async delete(req, res) {
// função deletar alguma questão
        const { id } = req.params;
// pegamos o id requerido pelo usuario para encontrar a questão

        try {
// inicio do tratamento de excessao
            await connection('questoes').where('id', id).delete();
// informa com o await que o sitema não vai para por causa dess tarefa, entra dentro da tabela questao
// vai ate a coluna id e compara qual id é igual ao que o usuario solicitou e a deleta
            return res.status(204).send();
// retona os status 204 .send() identifica que o que o antecede é um codigo 204 então instintivamente
// mande uma mensagem de operação concluida
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao deletar questão.' });
        }
// caso por açgum problema no servidor retorna o erro acima descrito
    }
};