require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
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
    connection: process.env.DATABASE_URL, // O Render/Railway vai preencher isso
    migrations: {
      directory: './database/migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};