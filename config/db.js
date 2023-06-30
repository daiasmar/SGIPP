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
            let productos = await cnx`SELECT sku,nombre,descripcion,stock.estado FROM productos INNER JOIN stock ON productos.stock = stock.id`;
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
            let entradas = await cnx`SELECT entradas.id,cantidad,fecha_entrada,fecha_caducidad,estados.estado FROM entradas INNER JOIN estados ON entradas.estado = estados.id WHERE entradas.id = ${id}`;
            callback(entradas)
        }catch(exc){
            callback({ resultado : 'ko' })
        }finally{
            cnx.close();
        }
    })
}

function crearEntrada(producto,cantidad,fechaCaducidad){
    return new Promise(async callback => {
        let resultado = 'ok';
        let cnx = await crearConexion();
        try{
            await cnx`INSERT INTO entradas (producto,cantidad,fecha_caducidad) VALUES (${producto},${cantidad},${fechaCaducidad})`;
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
        let cnx = await crearConexion();
        try{
            await cnx`SELECT entradas.id,cantidad,fecha_entrada,fecha_caducidad,estados.estado FROM entradas INNER JOIN estados ON entradas.estado = estados.id WHERE entradas.id = ${id}`;
            callback(productos)
        }catch(exc){
            callback({ resultado : 'ko' })
        }finally{
            cnx.close();
        }
    })
}

leerEntradas(1).then(res => console.log(res))