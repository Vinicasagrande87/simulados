const connection = require('../database/connection');
// criando uma variavel com o nome connection e atribuindo a ela o acesso ate o arquivo connection
//responsavel pela conexão com o banco de dados

module.exports = {
// informando que o que estiver dentro dessa chave sera o qure vamos conectar com o banco

    // 1. Cria o simulado (O que você já testou e funcionou)
    async create(req, res) {
// criando uma função assincrona de simulado
        const { titulo, professor_id, semestre_referencia } = req.body;
// aqui vão os dados digitatos pelo usuario para preencher as colunas acima descritas entre chaves

        try {
// tratamento de excessão
            const [id] = await connection('simulados').insert({
// criando um array id e com a ajuda da conexão feita pelo comando connection('simulados') e 
// cuidado para não travar a app com o comando await, usamos o comand .insert({ para inserir dados das colunas 
// abaixo
                titulo,
                professor_id,
                semestre_referencia
            }).returning('id');
// retorna todo o id que o usuario preencheu

            return res.status(201).json({ 
                id, 
                message: 'Simulado iniciado com sucesso!' 
            });
// junto uma mensagem de sucesso com os status 201

        } catch (error) {
// caso de algum problema com o servidor 
            console.error("ERRO NO BANCO:", error.message);
            return res.status(400).json({ 
                error: 'Erro ao criar simulado.',
                details: error.message 
            });
// volta uma mensagem de erro ao usuario e a descrição desse erro
        }
    },

    // 2. Lista todos os simulados (Para a tela inicial do aluno)
    async index(req, res) {
// funçaõ assincrona para listar(ler)
        try {
// tratamento de excessão
            const simulados = await connection('simulados').select('*');
// criando a variavel simulados usando o comando connection('simulados') para entrar na tabela simulados 
// nos precavendo de possiveis problemas(travar) com o await e o .select('*') seleciona toda a tabela
            return res.json(simulados);
// retorna o simulado requisitado pelo usuario
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar simulados.' });
        }
// caso de problema no servidor, na tela vem os status 500 com a informão de eero ao buscar os dados
    },

    // 3. MOSTRA O SIMULADO COMPLETO (Questões + Alternativas)
    // Rota: GET /simulados/:id
    async show(req, res) {
// função assincrona que faz uma busca especifica
        const { id } = req.params;
        const { usuario_id } = req.query; 
// coletando o id requerido pelo usuario 

        try {
// inicio do tratamento de excessao
            // Busca os dados básicos do simulado
            const simulado = await connection('simulados')
// criando uma variavel com o nome simulado e atribuindo a ela a tabela simulados
                .where('id', id)
// aqui a busca fica mais especifica, procuramos dentro da tabela a coluna id en fazemos uma busca 
// dentro dessa coluna que bat com a digitada pelo usuario
        .first();

// O .first() serve para "desembrulhar" o resultado: 
// em vez de o banco me devolver uma LISTA com um simulado dentro [ {simulado} ],
// ele me entrega o OBJETO do simulado direto {simulado}.
// Isso facilita o acesso no Front-end, pois usamos 'simulado.titulo' em vez de 'simulado[0].titulo'.


            if (!simulado) {
// se o simulado digitado pelo usuario não existir no banco de dados...
                return res.status(404).json({ error: 'Simulado não encontrado.' });
            }
// retorna um erro 404 e a informação de simulado não encontrado

            // TRAVA DE SEGURANÇA: Verifica se o aluno tem o semestre necessário
            if (usuario_id) {
// aqui verificamos se ha algum dado digitado pelo usuario na coluna usuario id
                const usuario = await connection('usuarios')
// aqui estou fazendo a ponte para a tabela usuarios e usando await informa para o sitema não travar
//devido a essa busca, logo tendo sido feita, guardo essa ponte(conexão) dentro da varial usuario
                    .where('id', usuario_id)
                    .select('semestre_atual', 'tipo')
                    .first();
// where(onde id é igual ao usuario_id)select(selecione semestre_atual e tipo) e mostre só a primeira linha first


                if (usuario && usuario.tipo === 'aluno' && usuario.semestre_atual < simulado.semestre_referencia) {
//se usuario existir, se usuario.tipo foi igual a aluno, se usuario.semestre_atual for menor 
// que simulado.semestre_referencia ai então retorne o que esta abaixo
                    return res.status(403).json({ 
                        error: 'Acesso negado.', 
                        details: `Este simulado é para o ${simulado.semestre_referencia}º semestre. Você está no ${usuario.semestre_atual}º.` 
                    });
// mensagem de acesso acesso negado
                }
            }

            // Busca todas as questões que estão ligadas a esse simulado
            const questoes = await connection('simulado_questoes')
// ou se o id que o usuario digitou existe o codigo abaixo acontece
                .where('simulado_id', id)
// faz a comparação entre o simulado_id com o id fornecido pelo usuario
                .join('questoes', 'questoes.id', '=', 'simulado_questoes.questao_id')
// aqui juntamos a tabela questoes/coluna questoes_id e a tabela
// simulados_questoes/coluna questao_id
                .select('questoes.*');

            // Aqui está o segredo: para cada questão, buscamos suas alternativas
            const simuladoCompleto = await Promise.all(
// com o formulario quase todo pronto para ser enviado ao usuario requisitante, ainda falta as alternativas
// o promise entrega somente o formulario todo pronto, com esse formulario atribuido a variavel 
// simuladoCompleto
                questoes.map(async (questao) => {       
// aqui se inicia a tranfomação da promessa acima feita, pegamo o ARRAY questoes e informamos que ele sera 
//substituido por um nova com um nov atributo(alternativas)
                    const alternativas = await connection('alternativas')
//uso a variavel atribuida connection para ir ate a tabela alternativas e atribuo essa conexão na variavel 
// alternativas 
                        .where('questao_id', questao.id)        
// aqu a comparação, onde, coluna questao_id tiver a mesmo informação dada pelo usario no questão id
                        .select('*');
// seleciona a linha toda
                    
                    return {...questao, alternativas};  
// aqui estou fazendo um Spread Operator (Operador de Espalhamento) pegando o array questão e pondo junto com
// o resultado da variavel alternativas
                })
            );

          
            return res.json({...simulado, Questoes: simuladoCompleto });
// retorna ao front as informações do array simulado, depois a chave(titulo Questoes) e o restante do simulado

        } catch (error) {
            console.error("Erro ao montar simulado:", error.message);
            return res.status(500).json({ error: 'Erro ao carregar os detalhes do simulado.' });
        }
    }
};