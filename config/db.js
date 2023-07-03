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

function leerEntradas(id){
    return new Promise(async callback => {
        let cnx = await crearConexion();
        try{
            let entradas = await cnx`SELECT entradas.id,productos.nombre,lote,cantidad,fecha_entrada,fecha_caducidad,estados.estado,sesiones.usuario FROM entradas INNER JOIN estados ON entradas.estado = estados.id INNER JOIN sesiones ON entradas.usuario = sesiones.id RIGHT JOIN productos ON entradas.producto = productos.id WHERE productos.id = ${id}`;
            callback(entradas)
        }catch(exc){
            callback({ resultado : 'ko' })
        }finally{
            cnx.close();
        }
    })
}

function crearEntrada(producto,lote,cantidad,fechaCaducidad,usuario){
    return new Promise(async callback => {
        let resultado = 'ok';
        let cnx = await crearConexion();
        try{
            await cnx`INSERT INTO entradas (producto,lote,cantidad,fecha_caducidad,usuario) VALUES (${producto},${lote},${cantidad},${fechaCaducidad},${usuario})`;
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

module.exports = {leerProductos,crearProducto,leerEntradas,crearEntrada,eliminarEntrada,leerSesiones};