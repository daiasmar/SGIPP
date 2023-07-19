function ajax(URL,metodo,datos){ // Conecta con una URL, envia datos y recibe una respuesta en JSON
    let config = { // Objeto de configuración
        method : metodo,
        body : JSON.stringify(datos),
        headers : {
            'Content-type' : 'application/JSON',
        }
    }
    
    return fetch(URL,config).then(res => res.json()); // Promesa
}