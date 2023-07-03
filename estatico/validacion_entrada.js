const formulario = document.querySelector('form');
const lote = document.querySelector('form div:first-child input');
const cantidad = document.querySelector('form div:nth-child(2) input');
const fecha = document.querySelector('form div:nth-child(3) input');
const error = document.querySelector('section p');

formulario.addEventListener('submit', e => {
    e.preventDefault();
    if(lote.value.trim() != '' && cantidad.value.trim() != '' && fecha.value.trim() != ''){
        
        if(/^\d*$/.test(cantidad.value)){
            return formulario.submit();
        }
    }
    
    error.innerHTML = 'Los datos introducidos no son correctos';
})