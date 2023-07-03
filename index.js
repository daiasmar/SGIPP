const express = require('express');
const {urlencoded} = require('body-parser');
const session = require('express-session');
const {leerProductos,leerEntradas,crearProducto,crearEntrada,eliminarEntrada,leerSesiones} = require('./config/db');

const servidor = express();

servidor.set('view engine','ejs');

servidor.use(session({
    secret : '&NAtfFSb#s&tTkVP',
    resave : true,
    saveUninitialized : false
}));

servidor.use(express.static('./estatico'));
servidor.use(urlencoded({extended:true}));

servidor.get('/login', (req, res) => {
    if(!req.session.usuario){
        return res.render('login', { error : false });
    }
    res.redirect('/');
});

servidor.post('/login', async (req, res) => {
    let {usuario,contraseña} = req.body;
    let {resultado,id} = await leerSesiones(usuario.trim(),contraseña.trim());
    if(resultado == 'ok'){
        req.session.usuario = usuario;
        req.session.id = id;
        return res.redirect('/');
    }
    res.render('login', {error : true})
})

servidor.get('/', async (req, res) => {
    if(req.session.usuario){
        let usuario = req.session.usuario;
        let productos = await leerProductos();
        return res.render('index', {productos, usuario});
    }
    res.redirect('/login');
})

servidor.get('/nuevo-producto', async (req, res) => {
    if(req.session.usuario){
        return res.render('añadir');
    }
    res.redirect('/login');
})

servidor.post('/nuevo-producto', async (req, res) => {
    let {sku,nombre,descripcion} = req.body;
    let {resultado} = await crearProducto(sku,nombre.trim(),descripcion.trim());
    if(resultado == 'ok'){
        return res.redirect('/');
    }
    res.send('ha ocurrido un error, intente mas tarde');
});

servidor.get('/entrada/:id(\\d{1,11})', async (req, res) => {
    if(req.session.usuario){
        let id = req.params.id;
        let entradas = await leerEntradas(id);
        return res.render('entrada',{entradas, id : id});
    }
    res.redirect('/login');
});

servidor.post('/entrada/:id(\\d{1,11})', async (req, res) => {
    let {lote,cantidad,fecha_caducidad} = req.body;
    let producto = req.params.id;
    let usuario = req.session.id;
    let {resultado} = await crearEntrada(producto,lote,cantidad,fecha_caducidad,usuario);
    if(resultado == 'ok'){
        return res.redirect('/entrada/:id(\\d{1,11})')
    }
    res.send(usuario); 
})

servidor.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
})

servidor.use((req, res) => {
    if(req.session.usuario){
        return res.redirect('/');
    }
    res.redirect('/login');
});

servidor.listen(4000);