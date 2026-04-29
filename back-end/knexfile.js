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
    connection: {
      connectionString: process.env.DATABASE_URL,
      // Esta configuração de SSL é a que o Supabase exige para o Render
      ssl: {
        rejectUnauthorized: false
      }
    },
    migrations: {
      directory: './database/migrations'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};