const formulario = document.querySelector('form');
const lote = document.querySelector('form div:first-child input');
const cantidad = document.querySelector('form div:nth-child(2) input');
const fecha = document.querySelector('form div:nth-child(3) input');
const errorForm = document.querySelector('section form p');
const errorBorrar = document.querySelector('section > p');
const borrar = document.querySelectorAll('section div button');

formulario.addEventListener('submit', e => {
    e.preventDefault();
    if(lote.value.trim() != '' && cantidad.value.trim() != '' && fecha.value.trim() != ''){ /* Los input
    no debende estar vacios */
        if(/^\d*$/.test(cantidad.value)){ // La cantidad han de ser dígitos
            return formulario.submit(); 
        }
    }

    errorForm.classList.add('margin__top--20');
    errorForm.innerHTML = 'Los datos introducidos no son correctos'; // Mensaje de error
});

for(let i = 0; i < borrar.length; i++){
    borrar[i].addEventListener('click', async e => {
        let {resultado} = await ajax('/eliminar_entrada','DELETE', {id : parseInt(e.target.dataset.id)}); // Llamada AJAX
        if(resultado == 'ok'){
            return borrar[i].parentElement.remove(); // Elimina la entrada
        }
        
        errorBorrar.classList.add('margin__top--20');
        errorBorrar.innerHTML = 'No se ha podido borrar la entrada'; // Mensaje de error
    });
}