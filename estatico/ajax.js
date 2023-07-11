function ajax(){
    fetch('/eliminar-entrada', {
        method : 'DELETE',
        body : JSON.stringify({id : 1}),
        headers : {
            'Content-type' : 'application/JSON',
        }
    })
}