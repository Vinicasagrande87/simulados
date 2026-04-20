const connection = require('../database/connection');
// atribuindo a variavel connection o caminho até o arquivo connectio, reponsavel pela conexão com o banco

module.exports = {
// informa que o que estiver dentro das chaves ser a conexão com o banco nesse controller
    async create(req, res) {
// função assincrona de criação
        // Recebemos os dados brutos do Front-end/Thunder Client
        const { id_usuario, id_simulado, acertos, total_questoes } = req.body;
// colunas que serão criadas conforme a requisição do usuario dentro da tabela historico

        try {
// tratamento de excessão para o servidor não para e não aconça o the walking dead siga o comando abaixo
            // Cálculo da nota (Regra de 3 simples para chegar na nota de 0 a 10)
            const notaCalculada = (acertos / total_questoes) * 10;
// criando a variavel notaCalculada e atribuindo a ela primeiro a divisão entre as colunas acertos dividido
// por totral_questoes e apos, multiplicando por 10

            // Inserimos usando os nomes exatos da sua migration
            await connection('historico_tentativas').insert({
// await para nos dar a segurança do app não parar devido a uma busca for(BANCO) 
//connection('historico_tentativas') uso o caminho atribuido a variavel connection para chegar ate a tabela 
//historico_tentativas e inserir os dados abaixo
                aluno_id: id_usuario,       // na sua migration é aluno_id
                simulado_id: id_simulado,   // na sua migration é simulado_id
                nota: notaCalculada         // na sua migration é nota
            });

            return res.status(201).json({ 
                message: 'Resultado salvo com sucesso!',
                nota: notaCalculada.toFixed(2)
            });
// retorna ao usuario status 201 com a mesagem de sucesso, e fora das aspas mostra a coluna nota 
// com a variavel nota calcula com o toFixed(2) para arredondar o numero caso seja necessario
            
        } catch (error) {
// deu ruim, servidor para 
            console.error("ERRO NO HISTÓRICO:", error.message);
            return res.status(400).json({ 
                error: 'Erro ao salvar resultado no banco.',
                details: error.message 
            });
// mostra na tela para o usuario ERRO NO HISTORICO  e error.menssage informa o detalhe do erro
        }
    },

    async index(req, res) {
// função assincrona de lista(ler)
        const { usuario_id, usuario_tipo } = req.query; 
// pegando quem está logado para decidir o que mostrar (se é aluno ou professor)

        try {
//tratamento de excessão
            let query = connection('historico_tentativas')
// criando uma variavel historico e atribuindo a a ela a tabela hitorico_tentativas
// a usando o await para evitar que o sistema trave fazendo essa busca 
                .join('simulados', 'simulados.id', '=', 'historico_tentativas.simulado_id')
// aqui estou indo até a tabela simuldos e buscando a coluna simulados.id e
// indo ate a tabela hitorico_tentativas e buscando a coluna simulado_id
                .join('usuarios', 'usuarios.id', '=', 'historico_tentativas.aluno_id')
// aqui estou indo na tabela usuarios e buscando a coluna usuarios.id e
// indo ate a coluna historico_tentativas e buscando a coluna aluno_id
                .select([
                    'historico_tentativas.id',
                    'usuarios.nome as aluno_nome',
                    'simulados.titulo as simulado_titulo',
                    'historico_tentativas.nota',
                    'historico_tentativas.data_realizacao'
                ]);

            // REGRA DE NEGÓCIO: Se for ALUNO, vê apenas o dele (completo)
            if (usuario_tipo === 'aluno') {
                query.where('historico_tentativas.aluno_id', usuario_id)
                     .orderBy('data_realizacao', 'desc');
            } 
            // REGRA DE NEGÓCIO: Se for PROFESSOR, vê a última tentativa de cada aluno
            else if (usuario_tipo === 'professor') {
                query.distinctOn('historico_tentativas.aluno_id')
                     .orderBy('historico_tentativas.aluno_id')
                     .orderBy('data_realizacao', 'desc');
            }

            const historico = await query;
// depois de ter juntado todas as informações com das tabelas e colunas com o join
// eu seleciono (.select([) quais colunas eu quero que apareçam no meu filtro
// e as coiloco em ordem de data de realização  .orderBy('data_realizacao', 'desc');
            
            return res.json(historico);
        } catch (error) {
            console.error("Erro ao buscar histórico:", error.message);
            return res.status(500).json({ error: 'Erro ao buscar histórico.' });
        }
// aqui caso de algum problema com o servidor e não possamos acessar o banco, retorna essa mensagem
    }
};