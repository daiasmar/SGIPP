function ajax(URL,metodo,datos){
    let config = { // Objeto de configuración
        method : metodo,
        body : JSON.stringify(datos),
        headers : {
            'Content-type' : 'application/JSON',
        }
    }
    
    return fetch(URL,config).then(res => res.json()); // Recibe como respuesta JSON
}