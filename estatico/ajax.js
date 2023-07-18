function ajax(URL,metodo,datos){
    let config = {
        method : metodo,
        body : JSON.stringify(datos),
        headers : {
            'Content-type' : 'application/JSON',
        }
    }
    
    return fetch(URL,config).then(res => res.json())
}