const connection = require('../database/connection');

module.exports = {
    // 1. Cria o simulado (O que você já testou e funcionou)
    async create(req, res) {
        const { titulo, professor_id, semestre_referencia } = req.body;

        try {
            const [id] = await connection('simulados').insert({
                titulo,
                professor_id,
                semestre_referencia
            }).returning('id');

            return res.status(201).json({ 
                id, 
                message: 'Simulado iniciado com sucesso!' 
            });
        } catch (error) {
            console.error("ERRO NO BANCO:", error.message);
            return res.status(400).json({ 
                error: 'Erro ao criar simulado.',
                details: error.message 
            });
        }
    },

    // 2. Lista todos os simulados (Para a tela inicial do aluno)
    async index(req, res) {
        try {
            const simulados = await connection('simulados').select('*');
            return res.json(simulados);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar simulados.' });
        }
    },

    // 3. MOSTRA O SIMULADO COMPLETO (Questões + Alternativas)
    // Rota: GET /simulados/:id
    async show(req, res) {
        const { id } = req.params;

        try {
            // Busca os dados básicos do simulado
            const simulado = await connection('simulados')
                .where('id', id)
                .first();

            if (!simulado) {
                return res.status(404).json({ error: 'Simulado não encontrado.' });
            }

            // Busca todas as questões que estão ligadas a esse simulado
            const questoes = await connection('simulado_questoes')
                .where('simulado_id', id)
                .join('questoes', 'questoes.id', '=', 'simulado_questoes.questao_id')
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