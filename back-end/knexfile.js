require('dotenv').config();
const path = require("path");

// Este log vai aparecer no seu terminal e nos dirá exatamente o que o Node está lendo
console.log(">>> [DEBUG] DATABASE_URL lida:", process.env.DATABASE_URL);

module.exports = {
  development: {
    client: 'postgresql',
    connection: {
      // Usamos .trim() para limpar qualquer sujeira do terminal
      connectionString: (process.env.DATABASE_URL || "").trim(),
      ssl: { rejectUnauthorized: false }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, 'database', 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'database', 'seeds')
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      connectionString: (process.env.DATABASE_URL || "").trim(),
      ssl: { rejectUnauthorized: false }
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: path.resolve(__dirname, 'database', 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'database', 'seeds')
    }
  }
};