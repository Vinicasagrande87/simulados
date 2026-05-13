require('dotenv').config(); // Sempre a primeira linha

const express = require('express');
const cors = require('cors');
const routes = require('./routes'); 

const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(routes); 

const PORT = process.env.PORT || 3000; 

app.listen(PORT, () => {
    console.log(`Servidor ligado na porta ${PORT}`);
});