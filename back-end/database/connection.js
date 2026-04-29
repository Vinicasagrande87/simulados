const knex = require('knex');
const configuration = require('../knexfile');

// Esta lógica detecta se o sistema está no Render (production) ou no seu PC
// Se a variável NODE_ENV for 'production', ele usa o banco do Supabase
const config = process.env.NODE_ENV === 'production' 
    ? configuration.production 
    : configuration.development;

const connection = knex(config);

module.exports = connection;