const postgres = require('postgres');

// CREA LA CONEXION CON POSTGRESQL

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

// LEE LA TABLA 'productos' Y LA RELACIONA CON LA TABLA 'stock'

function leerProductos(){
    return new Promise(async callback => {
        let cnx = await crearConexion();
        try{
            let productos = await cnx`SELECT productos.id,sku,nombre,descripcion,stock.estado FROM productos INNER JOIN 
            stock ON productos.stock = stock.id ORDER BY id DESC`; // Orden descendente
            callback(productos); // Consulta con exito - Lista de productos
        }catch(exc){
            callback({ resultado : 'ko' }); // Fallo en la consulta
        }finally{
            cnx.close();
        }
    })
}

// CREA UNA ENTRADA EN LA TABLA 'productos'

function crearProducto(sku,nombre,descripcion){
    return new Promise(async callback => {
        let resultado = 'ok'; // Consulta con exito
        let cnx = await crearConexion();
        try{
            await cnx`INSERT INTO productos (sku,nombre,descripcion) VALUES (${sku},${nombre},${descripcion})`;
        }catch(exc){
            resultado = 'ko'; // Fallo en la consulta
        }finally{
            cnx.close();
            callback({resultado});
        }
    })
}

// LEE LA TABLA 'entradas' Y LA RELACIONA CON LAS TABLAS 'estados' Y 'sesiones'

function leerEntradas(id){
    return new Promise(async callback => {
        let cnx = await crearConexion();
        try{
            let entradas = await cnx`SELECT entradas.id,productos.nombre,lote,cantidad,fecha_entrada,fecha_caducidad
            ,estados.estado,sesiones.usuario FROM entradas INNER JOIN estados ON entradas.estado = estados.id INNER JOIN 
            sesiones ON entradas.usuario = sesiones.id RIGHT JOIN productos ON entradas.producto = productos.id 
            WHERE productos.id = ${id} ORDER BY id DESC`; // Orden descendente
            callback(entradas); // Consulta con exito - Lista de entradas
        }catch(exc){
            callback({ resultado : 'ko' }); // Fallo en la consulta
        }finally{
            cnx.close();
        }
    })
}

// CREA UNA ENTRADA EN LA TABLA 'entradas'

function crearEntrada(producto,lote,cantidad,fechaEntrada,fechaCaducidad,usuario){
    return new Promise(async callback => {
        let resultado = 'ok'; // Consulta con exito
        let cnx = await crearConexion();
        try{
            await cnx`INSERT INTO entradas (producto,lote,cantidad,fecha_entrada,fecha_caducidad,usuario) 
            VALUES (${producto},${lote},${cantidad},${fechaEntrada},${fechaCaducidad},${usuario})`;
        }catch(exc){
            resultado = 'ko'; // Fallo en la consulta
        }finally{
            cnx.close();
            callback({resultado});
        }
    })
}

// ELIMINA UNA ENTRADA EN LA TABLA 'entradas'

function eliminarEntrada(id){
    return new Promise(async callback => {
        let resultado = 'ok'; // Consulta con exito
        let cnx = await crearConexion();
        try{
            await cnx`DELETE FROM entradas WHERE id = ${id}`;
        }catch(exc){
            resultado = 'ko'; // Fallo en la consulta
        }finally{
            cnx.close();
            callback({resultado})
        }
    })
}

// CONSULTA SI UN USUARIO Y SU RESPECTIVA CONTRASEÑA ESTÁN EN LA TABLA 'sesiones'

function leerSesiones(usuario,contraseña){
    return new Promise(async callback => {
        let resultado = 'ok'; // Consulta con exito
        let cnx = await crearConexion();
        try{
            let consulta = await cnx`SELECT * FROM sesiones WHERE usuario = ${usuario} AND contraseña = ${contraseña}`;
            if(consulta.count > 0){ // Existe una coincidencia - Id del usuario
                callback({resultado, id : consulta[0].id}) 
            }
            resultado = 'ko'; // No existe coincidencia
        }catch(exc){
            resultado = 'ko'; // Fallo en la consulta
        }finally{
            callback({resultado})
            cnx.close();
        }
    })
}

// ACTUALIZA EL ESTADO DE LA CASILLA 'estado' EN LA TABLA 'entradas'

function actualizarEstado(id, estado){
    return new Promise(async callback => {
        let resultado = 'ok'; // Consulta con exito
        let cnx = await crearConexion();
        try{
            await cnx`UPDATE entradas SET estado = ${estado} WHERE id = ${id}`;
        }catch(exc){
            resultado = 'ko'; // Fallo en la consulta
        }finally{
            cnx.close();
            callback({resultado})
        }
    })
}

// LEE TODAS LAS ENTRADAS CORRESPONDIENTES A UN PRODUCTO ESPECIFICO

function leerStock(producto){
    return new Promise(async callback => {
        let cnx = await crearConexion();
        try{
            let cantidades = await cnx`SELECT id,cantidad FROM entradas WHERE producto = ${producto}`;
            callback(cantidades.count) // Consulta con exito - Número de entradas
        }catch(exc){
            callback({ resultado : 'ko' }) // Fallo en la consulta
        }finally{
            cnx.close();
        }
    })
}

// ACTUALIZA EL ESTADO DE LA CASILLA 'stock' EN LA TABLA 'productos' 

function actualizarStock(id,stock){
    return new Promise(async callback => {
        let resultado = 'ok'; // Consulta con exito
        let cnx = await crearConexion();
        try{
            await cnx`UPDATE productos SET stock = ${stock} WHERE id = ${id}`;
        }catch(exc){
            resultado = 'ko'; // Fallo en la consulta
        }finally{
            cnx.close();
            callback({resultado})
        }
    })
}

module.exports = {leerProductos,crearProducto,leerEntradas,crearEntrada,eliminarEntrada,leerSesiones,actualizarEstado
    ,leerStock,actualizarStock};