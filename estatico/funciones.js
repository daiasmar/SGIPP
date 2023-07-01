const formulario = document.querySelector('form');
const sku = document.querySelector('input:first-child');
const nombre = document.querySelector('input:nth-child(2)');
const descripcion = document.querySelector('input:last-child');

formulario.addEventListener('submit', e => {
    e.preventDefault();
    if(/^[A-Z]{2}\d{6}$/.test(sku.value) && /^[A-ZÁÉÍÓÚÑ]+$/.test(nombre.value)){
        return console.log('correcto');
    }
    console.log('error');
});