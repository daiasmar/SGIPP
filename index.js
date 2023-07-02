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

servidor.post('/nuevo-producto', async (req, res) => {
    let {sku,nombre,descripcion} = req.body;
    let {resultado} = await crearProducto(sku,nombre.trim(),descripcion.trim());
    if(resultado == 'ok'){
        return res.redirect('/');
    }
    res.send('ha ocurrido un error, intente mas tarde');
});

servidor.listen(4000);