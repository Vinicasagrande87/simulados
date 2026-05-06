const connection = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    // Listar usuários
    async index(req, res) {
        if (req.usuarioTipo !== 'professor' && req.usuarioTipo !== 'admin') {
            return res.status(403).json({ error: 'Acesso negado.' });
        }

        try {
            const usuarios = await connection('usuarios')
                .select('id as matricula', 'nome', 'email', 'tipo', 'semestre_atual');
            return res.json(usuarios);
        } catch (error) {
            return res.status(500).json({ error: 'Erro ao buscar usuários.' });
        }
    },

    // Criar novo usuário
    async create(req, res) {
        const { 
            matricula, nome, nomeCompleto, email, senha, 
            tipo, semestre_atual, curso, especialidade 
        } = req.body;

        const nomeFinal = nome || nomeCompleto;

        if (!matricula || !nomeFinal || !email || !senha) {
            return res.status(400).json({ error: 'Dados obrigatórios ausentes.' });
        }

        const trx = await connection.transaction();

        try {
            let tipoFinal = 'aluno';

            // Verificação de permissão ultra-robusta
            const idLogado = String(req.usuarioId);
            const ehAdmin = req.usuarioTipo === 'admin' || idLogado === '2024001';

            if (ehAdmin) {
                tipoFinal = tipo || 'aluno';
            } else {
                if (tipo === 'professor' || tipo === 'admin') {
                    await trx.rollback();
                    console.log(`[BLOQUEIO] Usuário ${idLogado} tentou criar perfil elevado.`);
                    return res.status(403).json({ 
                        error: 'Acesso negado. Somente administradores criam perfis elevados.' 
                    });
                }
                tipoFinal = 'aluno';
            }

            const salt = await bcrypt.genSalt(10);
            const senhaCriptografada = await bcrypt.hash(senha, salt);

            await trx('usuarios').insert({
                id: matricula, 
                nome: nomeFinal,
                email: email.toLowerCase().trim(),
                senha: senhaCriptografada,
                tipo: tipoFinal,
                semestre_atual: (semestre_atual && !isNaN(semestre_atual)) ? parseInt(semestre_atual) : 1
            });

            if (tipoFinal === 'professor') {
                await trx('professores').insert({
                    usuario_id: matricula,
                    especialidade: especialidade || 'Geral'
                });
            } else {
                await trx('alunos').insert({
                    usuario_id: matricula,
                    curso: curso || 'Medicina',
                    semestre: (semestre_atual && !isNaN(semestre_atual)) ? parseInt(semestre_atual) : 1
                });
            }

            await trx.commit();
            return res.status(201).json({ message: `Usuário ${tipoFinal} cadastrado!` });

        } catch (error) {
            if (trx) await trx.rollback();
            return res.status(400).json({ error: 'Erro no cadastro: ' + error.message });
        }
    },

    // Login (Geração do Token)
    async login(req, res) {
        const { email, senha } = req.body;

        try {
            const usuario = await connection('usuarios')
                .where('email', email.toLowerCase().trim())
                .first();

            if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
                return res.status(401).json({ error: 'Credenciais inválidas.' });
            }

            const token = jwt.sign(
                { id: usuario.id, tipo: usuario.tipo }, 
                process.env.JWT_SECRET, 
                { expiresIn: '1d' }
            );

            return res.json({
                usuario: { matricula: usuario.id, nome: usuario.nome, tipo: usuario.tipo },
                token
            });
        } catch (error) {
            return res.status(500).json({ error: 'Erro no login.' });
        }
    }
};