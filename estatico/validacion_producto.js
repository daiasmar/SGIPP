const formulario = document.querySelector('form');
const sku = document.querySelector('div:first-child input');
const nombre = document.querySelector('div:nth-child(2) input');
const descripcion = document.querySelector('div:nth-child(3) input');
const error = document.querySelector('section p');

formulario.addEventListener('submit', e => {
    e.preventDefault();
    if(sku.value.trim() != '' && nombre.value.trim() != '' && descripcion.value.trim() != ''){

        if(/^[A-Z]{2}\d{6}$/.test(sku.value) && /^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+\s?)+$/.test(nombre.value) && /^[A-ZÁÉÍÓÚÑ].+$/.test(descripcion.value)){
            return formulario.submit();
        }
    }
    
    error.innerHTML = 'Los datos introducidos no son correctos';
});