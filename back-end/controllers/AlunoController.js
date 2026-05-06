const knex = require('../database/connection');

module.exports = {
    // Listar todos os alunos com join em usuários
    async index(req, res) {
        try {
            const alunos = await knex('alunos')
                .join('usuarios', 'usuarios.id', '=', 'alunos.usuario_id')
                .select(
                    'alunos.id',            // ID do registro na tabela alunos
                    'alunos.curso',
                    'alunos.semestre',
                    'usuarios.nome',
                    'usuarios.email',
                    'usuarios.id as matricula' // Apelidamos o ID de usuário como matrícula
                );
            
            return res.json(alunos);
        } catch (error) {
            console.error("ERRO NO JOIN:", error.message);
            return res.status(500).json({ 
                error: 'Erro ao listar alunos',
                detalhe: error.message 
            });
        }
    },

    // Criar um novo perfil de aluno
    async create(req, res) {
        const { curso, semestre } = req.body;
        
        // O ID vem do token JWT decodificado pelo seu middleware
        const usuario_id = req.usuarioId; 

        try {
            // Validação de segurança: o usuário precisa existir na tabela usuarios
            const usuarioExiste = await knex('usuarios').where('id', usuario_id).first();
            
            if (!usuarioExiste) {
                return res.status(400).json({ error: 'Usuário logado não encontrado no banco.' });
            }

            // Inserção compatível com PostgreSQL (Neon)
            // Usamos .returning('*') para retornar o objeto completo criado
            const [novoAluno] = await knex('alunos').insert({
                curso,
                semestre,
                usuario_id
            }).returning('*');

            return res.status(201).json({ 
                message: "Perfil acadêmico criado com sucesso!",
                aluno: novoAluno 
            });
        } catch (error) {
            console.error("ERRO NO CADASTRO:", error.detail || error.message);
            return res.status(400).json({ 
                error: 'Erro ao cadastrar aluno',
                detalhe: error.detail || error.message 
            });
        }
    }
};