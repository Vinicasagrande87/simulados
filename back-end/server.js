require('dotenv').config(); // Sempre a primeira linha

const express = require('express');
const cors = require('cors');
const routes = require('./routes'); 

const app = express();

// Configuração do CORS para liberar o acesso do Front-end
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(routes); 

// O Render define a porta automaticamente através da variável de ambiente PORT
const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log(`Servidor ligado na porta ${PORT}`);
});