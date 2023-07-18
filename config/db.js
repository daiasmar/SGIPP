const postgres = require('postgres');

function crearConexion(){
    return new Promise(async callback => {
        callback(postgres({
            host : 'localhost',
            port : 5432,
            database : 'inventario',
            user : 'postgres',
            password : 'Microfonoguay80'
        }));
    })
}

function leerProductos(){
    return new Promise(async callback => {
        let cnx = await crearConexion();
        try{
            let productos = await cnx`SELECT productos.id,sku,nombre,descripcion,stock.estado FROM productos INNER JOIN stock ON productos.stock = stock.id`;
            callback(productos)
        }catch(exc){
            callback({ resultado : 'ko' })
        }finally{
            cnx.close();
        }
    })
}

function crearProducto(sku,nombre,descripcion){
    return new Promise(async callback => {
        let resultado = 'ok';
        let cnx = await crearConexion();
        try{
            await cnx`INSERT INTO productos (sku,nombre,descripcion) VALUES (${sku},${nombre},${descripcion})`;
        }catch(exc){
            resultado = 'ko';
        }finally{
            cnx.close();
            callback({resultado});
        }
    })
}

function leerTodasEntradas(){
    return new Promise(async callback => {
        let cnx = await crearConexion();
        try{
            let entradas = await cnx`SELECT id,fecha_caducidad,estado FROM entradas`;
            callback(entradas)
        }catch(exc){
            callback({ resultado : 'ko' })
        }finally{
            cnx.close();
        }
    })
}

function leerEntradas(id){
    return new Promise(async callback => {
        let cnx = await crearConexion();
        try{
            let entradas = await cnx`SELECT entradas.id,productos.nombre,lote,cantidad,fecha_entrada,fecha_caducidad,estados.estado,sesiones.usuario FROM entradas INNER JOIN estados ON entradas.estado = estados.id INNER JOIN sesiones ON entradas.usuario = sesiones.id RIGHT JOIN productos ON entradas.producto = productos.id WHERE productos.id = ${id} ORDER BY id DESC`;
            callback(entradas)
        }catch(exc){
            callback({ resultado : 'ko' })
        }finally{
            cnx.close();
        }
    })
}

function crearEntrada(producto,lote,cantidad,fechaEntrada,fechaCaducidad,usuario){
    return new Promise(async callback => {
        let resultado = 'ok';
        let cnx = await crearConexion();
        try{
            await cnx`INSERT INTO entradas (producto,lote,cantidad,fecha_entrada,fecha_caducidad,usuario) VALUES (${producto},${lote},${cantidad},${fechaEntrada},${fechaCaducidad},${usuario})`;
        }catch(exc){
            resultado = 'ko';
        }finally{
            cnx.close();
            callback({resultado});
        }
    })
}

function eliminarEntrada(id){
    return new Promise(async callback => {
        let resultado = 'ok';
        let cnx = await crearConexion();
        try{
            await cnx`DELETE FROM entradas WHERE id = ${id}`;
        }catch(exc){
            resultado = 'ko';
        }finally{
            cnx.close();
            callback({resultado})
        }
    })
}

function leerSesiones(usuario,contraseña){
    return new Promise(async callback => {
        let resultado = 'ok';
        let cnx = await crearConexion();
        try{
            let consulta = await cnx`SELECT * FROM sesiones WHERE usuario = ${usuario} AND contraseña = ${contraseña}`;
            if(consulta.count > 0){
                callback({resultado, id : consulta[0].id})
            }
            resultado = 'ko';
        }catch(exc){
            resultado = 'ko';
        }finally{
            callback({resultado})
            cnx.close();
        }
    })
}

function actualizarEstado(id, estado){
    return new Promise(async callback => {
        let resultado = 'ok';
        let cnx = await crearConexion();
        try{
            await cnx`UPDATE entradas SET estado = ${estado} WHERE id = ${id}`;
        }catch(exc){
            resultado = 'ko';
        }finally{
            cnx.close();
            callback({resultado})
        }
    })
}

function leerStock(producto){
    return new Promise(async callback => {
        let cnx = await crearConexion();
        try{
            let cantidades = await cnx`SELECT id,cantidad FROM entradas WHERE producto = ${producto}`;
            callback(cantidades.count)
        }catch(exc){
            callback({ resultado : 'ko' })
        }finally{
            cnx.close();
        }
    })
}

function actualizarStock(id,stock){
    return new Promise(async callback => {
        let resultado = 'ok';
        let cnx = await crearConexion();
        try{
            await cnx`UPDATE productos SET stock = ${stock} WHERE id = ${id}`;
        }catch(exc){
            resultado = 'ko';
        }finally{
            cnx.close();
            callback({resultado})
        }
    })
}

module.exports = {leerProductos,crearProducto,leerTodasEntradas,leerEntradas,crearEntrada,eliminarEntrada,leerSesiones,actualizarEstado,leerStock,actualizarStock};