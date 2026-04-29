const knex = require('knex');
const configuration = require('../knexfile');

// Esta lógica detecta automaticamente se o sistema está no Render (production) ou no seu PC
// No Render, a variável NODE_ENV vale 'production', ativando o banco do Supabase com SSL.
const config = process.env.NODE_ENV === 'production' 
    ? configuration.production 
    : configuration.development;

const connection = knex(config);

module.exports = connection;