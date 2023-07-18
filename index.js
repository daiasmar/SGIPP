const express = require('express'); // Módulo para crear el servidor
const {urlencoded, json} = require('body-parser'); // Módulo que intercepta el contenido de una petición
const session = require('express-session'); // Módulo que permite gestionar las sesiones de usuarios
const {leerProductos,leerTodasEntradas,leerEntradas,crearProducto,crearEntrada,eliminarEntrada,leerSesiones,actualizarEstado,leerStock,actualizarStock} = require('./config/db'); // Módulo que realiza peticiones específicas a la base de datos
const {convertirDia} = require('./config/numeros'); // Módulo que convierte una cantidad de milisegundos a dias

const servidor = express(); // Iniciación de Express

servidor.set('view engine','ejs'); // Setting del sistema de plantillas EJS

servidor.use(session({ // Configuración del modulo express-session
    secret : '&NAtfFSb#s&tTkVP',
    resave : true,
    saveUninitialized : false
}));

servidor.use(express.static('./estatico')); // Configuración de ficheros estaticos
servidor.use(urlencoded({extended:true})); // Intercepta cuerpo en la URL
servidor.use(json()); // Intercepta cuerpo en formato JSON de la petición

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

servidor.use(async (req,res,nxt) => {
    let productos = await leerProductos();
    for(let i = 0; i < productos.length; i++){
        let resultado = await leerStock(productos[i].id);
        if(resultado !== 0){
            actualizarStock(productos[i].id,2);
            return nxt();
        }
        actualizarStock(productos[i].id,1);
    }
    nxt();
});

servidor.get('/login', (req, res) => { // Petición con el metodo GET a la pagina de LOGIN
    if(!req.session.usuario){
        return res.render('login', { error : false }); // Render de la plantilla login.ejs 
    }
    res.redirect('/');
});

servidor.post('/login', async (req, res) => { // Envio de datos de usuario y contraseña con el método POST a la pagina de LOGIN
    let {usuario,contraseña} = req.body;
    let {resultado,id} = await leerSesiones(usuario.trim(),contraseña.trim()); // Búsqueda en la base de datos a los usuarios con su respectiva contraseña
    if(resultado == 'ok'){
        req.session.usuario = usuario;
        req.session.idBBDD = id; // Guardo de la sesion el id del usuario y su nombre
        return res.redirect('/');
    }
    res.render('login', { error : true })
})

servidor.get('/', async (req, res) => { // Petición a la pagina PRINCIPAL, render de index.ejs
    if(req.session.usuario){
        let usuario = req.session.usuario;
        let productos = await leerProductos(); // Pedir el listado de productos a la base de datos
        return res.render('index', { productos, usuario });
    }
    res.redirect('/login');
});

servidor.get('/agregar_producto', (req,res) => {
    if(req.session.usuario){
        return res.render('agregar');
    }
    res.redirect('/login');
});

servidor.post('/agregar_producto', async (req, res) => { // Peticion POST que envia los datos para crear el nuevo producto
    let {sku,nombre,descripcion} = req.body;
    let {resultado} = await crearProducto(sku,nombre.trim(),descripcion.trim());
    if(resultado == 'ok'){
        return res.redirect('/');
    }
    res.status(500);
    res.render('error');
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
    let usuario = req.session.idBBDD;
    let {resultado} = await crearEntrada(producto,lote,cantidad,hoy,fecha_caducidad,usuario);
    if(resultado == 'ok'){
        return res.redirect(`/entrada/${producto}`);
    }
    res.status(500);
    res.render('error');
});

servidor.delete('/eliminar_entrada', async (req, res) => { // eliminar entrada
    let idEntrada = req.body.id;
    let resultado = await eliminarEntrada(idEntrada);
    res.json(resultado);
});

servidor.get('/logout', (req, res) => { // Cerrar sesion
    req.session.destroy(() => res.redirect('/login'));
});

servidor.use((exc, req, res, nxt) => {
    res.status(404);
    res.render('error');
});

servidor.use((req, res) => { // Redireccionar si la URL no existe
    if(req.session.usuario){
        return res.redirect('/');
    }
    res.redirect('/login');
});

servidor.listen(4000);