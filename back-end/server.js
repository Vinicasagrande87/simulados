require('dotenv').config();
// ligando as chaves do arquivo .env

const express = require('express');
// instanciando o framework express em uma variavel chamada express

const cors = require('cors');
// instanciando o biblioteca cors, responsavel por permitir a comunicação entre back e front

const routes = require('./routes'); 
// Importando o arquivo de rotas que criamos

const app = express();
// instanciando as aplicações do express na variavel app

const PORT = process.env.PORT || 3000;
// informando a porta que a aplicação vai funcionar

app.use(cors());
// Habilita o CORS para comunicações externas (Front-end <-> Back-end)

app.use(express.json());
// ligando o middleware que faz a tradução do express e json

app.use(routes); 
// Ligando o arquivo de rotas na aplicação

app.listen(PORT, ()=>{
    console.log(`Servidor ligado na porta ${PORT}`)
});