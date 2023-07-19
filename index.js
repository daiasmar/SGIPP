const express = require('express'); // Módulo para crear el servidor
const {urlencoded, json} = require('body-parser'); // Módulo que intercepta el contenido de una petición
const session = require('express-session'); // Módulo que permite gestionar las sesiones de usuarios
const {leerProductos,leerEntradas,crearProducto,crearEntrada,eliminarEntrada,leerSesiones,actualizarEstado,leerStock
    ,actualizarStock} = require('./config/db'); // Módulo que realiza peticiones específicas a la base de datos
const {convertirDia} = require('./config/dia'); // Módulo que convierte una cantidad de milisegundos a dias

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

// INICIAR SESIÓN

servidor.get('/login', (req, res) => {
    if(!req.session.usuario){ // Cuando no hay usuario en sesión
        return res.render('login', { error : false }); // Render de la plantilla login.ejs
    }
    res.redirect('/'); // En caso de existir sesión
});

servidor.post('/login', async (req, res) => {
    let {usuario,contraseña} = req.body; // Extraigo usuario y contraseña enviados
    let {resultado,id} = await leerSesiones(usuario.trim(),contraseña.trim()); // Búsqueda en la base de datos
    if(resultado == 'ok'){
        req.session.usuario = usuario; // Guardo el usuario en la sesión
        req.session.idBBDD = id; // Guardo el id de la base de datos en la sesión
        return res.redirect('/'); // Entro en el sistema
    }
    res.render('login', { error : true }) // En caso de datos incorrectos
});

// PÁGINA PRINCIPAL

servidor.get('/', async (req, res) => {
    if(req.session.usuario){
        let usuario = req.session.usuario; // Nombre de usuario de la sesión
        let productos = await leerProductos(); // Pido la lista de productos a la base de datos

        // ACTUALIZACIÓN DE STOCK

        for(let i = 0; i < productos.length; i++){
            let resultado = await leerStock(productos[i].id); // Consulta del número de entradas

            if(resultado !== 0){
                actualizarStock(productos[i].id,2); // Consulta que actualiza a 'En Stock'
            }else{
                actualizarStock(productos[i].id,1); // Consulta que actualiza a 'Sin Stock'
            }

            productos = await leerProductos(); // Nueva consulta con los productos actualizados
        }

        return res.render('index', { productos, usuario }); // Render de la pantilla index.ejs con datos
    }

    res.redirect('/login'); // En caso de no existir sesión
});

// PÁGINA PARA CREAR NUEVO PRODUCTO

servidor.get('/agregar_producto', (req,res) => {
    if(req.session.usuario){
        return res.render('agregar'); // Render de la pantilla agregar.ejs
    }
    res.redirect('/login'); 
});

servidor.post('/agregar_producto', async (req, res) => {
    let {sku, nombre, descripcion} = req.body; // Datos enviados en el form
    let {resultado} = await crearProducto(sku,nombre.trim(),descripcion.trim()); // Consulta con los datos depurados
    if(resultado == 'ok'){
        return res.redirect('/');
    }
    res.status(500); // Error en las bases de datos 
    res.render('error'); // Render de la pantilla error.ejs
});

// PÁGINA PARA VISUALIZAR Y REGISTRAR ENTRADAS

servidor.get('/entrada/:id(\\d{1,11})', async (req, res) => {
    if(req.session.usuario){
        let id = req.params.id; // Id del producto como parámetro en la URL
        let entradas = await leerEntradas(id); // Consulta para las entradas específicas
        let hoy = new Date().setHours(0,0,0,0); // Fecha de hoy desde las 00:00:00
        
        // ACTUALIZAR ESTADO DE LAS ENTRADAS

        for(let i = 0; i < entradas.length; i++){
            if(entradas[0].id !== null){ // Si no hay entradas la primera consulta solo proporciona el nombre
                let caducidad = entradas[i].fecha_caducidad.setHours(0,0,0,0); // Fecha de caducidad desde las 00:00:00

                if(convertirDia(caducidad - hoy) < 3 && convertirDia(caducidad - hoy) >= 0){
                    await actualizarEstado(entradas[i].id,2); // Consulta que actualiza a 'Vence Pronto'
                }else if(convertirDia(caducidad - hoy) < 0){
                    await actualizarEstado(entradas[i].id,1); // Consulta que actualiza a 'Vencido'
                }

                entradas = await leerEntradas(id); // Nueva consulta con los productos actualizados
            }
        }
    
        return res.render('entrada', { entradas, id }); // Render de la pantilla entrada.ejs con datos
    }
    res.redirect('/login');
});

servidor.post('/entrada/:id(\\d{1,11})', async (req, res) => {
    let {lote, cantidad, fecha_caducidad} = req.body; // Datos enviados en el form
    let hoy = new Date(); // Fecha de hoy
    let producto = req.params.id; // Id del producto como parámetro en la URL
    let usuario = req.session.idBBDD; // Id del usuario de la base de datos en la sesión
    let {resultado} = await crearEntrada(producto,lote,cantidad,hoy,fecha_caducidad,usuario); // Consulta pasando datos
    if(resultado == 'ok'){
        return res.redirect(`/entrada/${producto}`); 
    }
    res.status(500);
    res.render('error');
});

// ENDPOINT PARA ELIMINAR ENTRADA

servidor.delete('/eliminar_entrada', async (req, res) => {
    let idEntrada = req.body.id; // Id de la entrada
    let resultado = await eliminarEntrada(idEntrada); // Consulta
    res.json(resultado); // Respuesta en JSON
});

// CERRAR SESIÓN

servidor.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login')); // Destruir sesión
});

// ERROR DE 404 PARA PÁGINAS DE PRODUCTO - ENTRADAS QUE NO EXISTEN

servidor.use((exc, req, res, nxt) => {
    res.status(404);
    res.render('error');
});

// CONTROL QUE REDIRECCIONA A LA PAGINA PRINCIPAL O A LA DE INICIAR SESIÓN 

servidor.use((req, res) => {
    if(req.session.usuario){
        return res.redirect('/');
    }
    res.redirect('/login');
});

servidor.listen(4000);