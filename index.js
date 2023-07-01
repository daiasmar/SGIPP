const express = require('express');
const {urlencoded} = require('body-parser');
const session = require('express-session');
const {leerProductos,leerEntradas,crearProducto,crearEntrada,eliminarEntrada} = require('./config/db');

const servidor = express();

servidor.set('view engine','ejs');
servidor.use(express.static('./estatico'));
servidor.use(urlencoded({extended:true}));

servidor.get('/', async (req, res) => {
    let productos = await leerProductos();
    res.render('index', { productos });
})

servidor.get('/nuevo-producto', async (req, res) => {
    res.render('añadir');
})

servidor.post('/nuevo-producto', (req, res) => {
    res.send(req.body);
});

servidor.listen(4000);