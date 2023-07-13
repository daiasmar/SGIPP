const express = require('express');
const {urlencoded, json} = require('body-parser');
const session = require('express-session');
const {leerProductos,leerTodasEntradas,leerEntradas,crearProducto,crearEntrada,eliminarEntrada,leerSesiones,actualizarEstado} = require('./config/db');
const {convertirDia} = require('./config/numeros');

const servidor = express();

servidor.set('view engine','ejs');

servidor.use(session({
    secret : '&NAtfFSb#s&tTkVP',
    resave : true,
    saveUninitialized : false
}));

servidor.use(express.static('./estatico'));
servidor.use(urlencoded({extended:true}));
servidor.use(json());

servidor.use(async (req,res,nxt) => {
    let entradas = await leerTodasEntradas();
    let hoy = new Date().setHours(0,0,0,0);
    for(let i = 0; i < entradas.length; i++){
        let caducidad = entradas[i].fecha_caducidad.setHours(0,0,0,0);
        if(convertirDia(caducidad - hoy) < 3){
            if(convertirDia(caducidad - hoy) < 0){
                await actualizarEstado(entradas[i].id,1);
                return nxt();
            }
            await actualizarEstado(entradas[i].id,2);
        }
    }
    nxt();
});

servidor.get('/login', (req, res) => { //Pagina de LOGIN
    if(!req.session.usuario){
        return res.render('login', { error : false });
    }
    res.redirect('/');
});

servidor.post('/login', async (req, res) => { // Enviar el formulario de Inicio de Sesion
    let {usuario,contraseña} = req.body;
    let {resultado,id} = await leerSesiones(usuario.trim(),contraseña.trim());
    if(resultado == 'ok'){
        req.session.usuario = usuario;
        req.session.idTabla = id;
        return res.redirect('/');
    }
    res.render('login', {error : true})
})

servidor.get('/', async (req, res) => { // Pagina principal 
    if(req.session.usuario){
        let usuario = req.session.usuario;
        let productos = await leerProductos();
        return res.render('index', {productos, usuario});
    }
    res.redirect('/login');
});

servidor.get('/nuevo-producto', async (req, res) => { // Crear nuevo producto
    if(req.session.usuario){
        return res.render('añadir');
    }
    res.redirect('/login');
});

servidor.post('/nuevo-producto', async (req, res) => { // POST para crear un nuevo producto
    let {sku,nombre,descripcion} = req.body;
    let {resultado} = await crearProducto(sku,nombre.trim(),descripcion.trim());
    if(resultado == 'ok'){
        return res.redirect('/');
    }
    res.send('ha ocurrido un error, intente mas tarde');
});

servidor.get('/entrada/:id(\\d{1,11})', async (req, res) => { // Pagina de cada producto
    if(req.session.usuario){
        let id = req.params.id;
        let entradas = await leerEntradas(id);
        return res.render('entrada',{entradas, id : id});
    }
    res.redirect('/login');
});

servidor.post('/entrada/:id(\\d{1,11})', async (req, res) => { // POST para crear una entrada en el producto
    let {lote,cantidad,fecha_caducidad} = req.body;
    let hoy = new Date();
    let producto = req.params.id;
    let usuario = req.session.idTabla;
    let {resultado} = await crearEntrada(producto,lote,cantidad,hoy,fecha_caducidad,usuario);
    if(resultado == 'ok'){
        return res.redirect('/entrada/:id(\\d{1,11})')
    }
    res.send('ha ocurrido un error, intente mas tarde');
});

servidor.delete('/eliminar-entrada', async (req, res) => { // eliminar entrada
    let idEntrada = req.body.id;
    let {resultado} = await eliminarEntrada(idEntrada);
    if(resultado == 'ok'){
        return res.json({resultado : 'ok'});
    };
    res.send('ha ocurrido un error, intente mas tarde');
})

servidor.get('/logout', (req, res) => { // Cerrar sesion
    req.session.destroy(() => res.redirect('/login'));
})

servidor.use((req, res) => { // Redireccionar si la URL no existe
    if(req.session.usuario){
        return res.redirect('/');
    }
    res.redirect('/login');
});

servidor.listen(4000);