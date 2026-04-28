require('dotenv').config();
// ligando as chaves do arquivo .env

const express = require('express');
// instanciando o framework express

const cors = require('cors');
// instanciando a biblioteca cors

const routes = require('./routes'); 
// Importando o arquivo de rotas

const app = express();

// --- CONFIGURAÇÃO DO CORS ---
// Colocamos opções extras para garantir que o navegador não bloqueie nada
app.use(cors({
    origin: '*', // Permite que qualquer endereço acesse (ideal para resolver o erro agora)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
// middleware que faz a tradução de JSON

app.use(routes); 
// Ligando o arquivo de rotas na aplicação

const PORT = process.env.PORT || 10000; 
// O Render usa preferencialmente a porta 10000

app.listen(PORT, () => {
    console.log(`Servidor ligado na porta ${PORT}`);
});