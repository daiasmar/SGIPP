function convertirDia(milisegundos){ 
    return milisegundos/86400000 // Devuelve unos milisegundos en dias para poder calcular la caducidad
}

function mostrarError(res,status,plantilla){ // Envia un status y randeriza una plantilla en caso de error
    res.status(status); 
    res.render(plantilla);
}

module.exports = {convertirDia,mostrarError}