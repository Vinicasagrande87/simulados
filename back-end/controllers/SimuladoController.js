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
                const usuario = await connection('usuarios')
                    .where('id', usuario_id)
                    .select('semestre_atual', 'tipo')
                    .first();

                if (usuario && usuario.tipo === 'aluno' && usuario.semestre_atual < simulado.semestre_referencia) {
                    return res.status(403).json({ 
                        error: 'Acesso negado.', 
                        details: `Este simulado é para o ${simulado.semestre_referencia}º semestre. Você está no ${usuario.semestre_atual}º.` 
                    });
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
                questoes.map(async (questao) => {
                    const alternativas = await connection('alternativas')
                        .where('questao_id', questao.id)
                        .select('*');
                    
                    return {
                        ...questao,
                        alternativas // Coloca as alternativas dentro da questão
                    };
                })
            );

            // Retorna o objeto do simulado com a lista de questões "recheadas"
            return res.json({
                ...simulado,
                questoes: simuladoCompleto
            });

        } catch (error) {
            console.error("Erro ao montar simulado:", error.message);
            return res.status(500).json({ error: 'Erro ao carregar os detalhes do simulado.' });
        }
    }
};