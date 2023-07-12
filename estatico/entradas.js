const formulario = document.querySelector('form');
const lote = document.querySelector('form div:first-child input');
const cantidad = document.querySelector('form div:nth-child(2) input');
const fecha = document.querySelector('form div:nth-child(3) input');
const error = document.querySelector('section p');
const borrar = document.querySelectorAll('.entrada button');

formulario.addEventListener('submit', e => {
    e.preventDefault();
    if(lote.value.trim() != '' && cantidad.value.trim() != '' && fecha.value.trim() != ''){
        
        if(/^\d*$/.test(cantidad.value)){
            return formulario.submit();
        }
    }
    
    error.innerHTML = 'Los datos introducidos no son correctos';
});

for(let i = 0; i < borrar.length; i++){
    borrar[i].addEventListener('click', async e => {
        console.log(borrar[i].parentElement)
        let {resultado} = await ajax('/eliminar-entrada','DELETE',{id : parseInt(e.target.dataset.id)})
        if(resultado == 'ok'){
            return borrar[i].parentElement.remove();
        }
        console.log('error')
    });
}