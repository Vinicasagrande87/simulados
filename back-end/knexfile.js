require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    migrations: {
      directory: './database/migrations'
    }
  },

  production: {
    client: 'pg',
    // MUDANÇA AQUI: Passamos a URL diretamente como string
    // O knex entende melhor assim em ambientes como o Render
    connection: process.env.DATABASE_URL + "?ssl=true", 
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './database/migrations'
    }
  }
};