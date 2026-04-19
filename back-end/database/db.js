const knex = require('knex');
// instanciando a biblioteca knex

const config = require('../knexfile');
// importando as configurações do arquivo knexfile.js

const db = knex(config.development);
// criando a conexão utilizando o ambiente de desenvolvimento (development)

module.exports = db;
// exportando a conexão para ser utilizada em outras partes da aplicação