const knex = require('knex');
const configuration = require('../knexfile');

const config = process.env.NODE_ENV === 'production' 
    ? configuration.production 
    : configuration.development;

// Proteção contra valores vazios ou mal formatados
if (config.connection && typeof config.connection === 'string') {
    config.connection = config.connection.trim();
} else if (config.connection && config.connection.connectionString) {
    config.connection.connectionString = config.connection.connectionString.trim();
}

const connection = knex(config);

module.exports = connection;