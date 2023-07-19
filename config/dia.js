function convertirDia(milisegundos){ 
    return milisegundos/86400000 // Devuelve unos milisegundos en dias para poder calcular la caducidad
}

module.exports = {convertirDia}