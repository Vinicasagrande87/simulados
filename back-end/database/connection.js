const knex = require('knex');
const configuration = require('../knexfile');

// Aqui usamos a configuração 'development' que definimos no knexfile
const connection = knex(configuration.development);

module.exports = connection;