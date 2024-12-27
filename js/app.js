//COTIZADOR DE CRIPTOMONEDAS
//Enlace API: https://min-api.cryptocompare.com/documentation

//Selección HTML
const monedaSelect = document.querySelector('#moneda');
const criptoSelect = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const resultados = document.querySelector('#resultado');

//Objeto Campos
const campos = {
    moneda: '',
    criptomoneda: ''
}

//Eventos
window.onload = () => {
    consultarCriptomonedas();

    cargarEventos();
}

//--//
function cargarEventos() {
    formulario.addEventListener('submit', (e) => submitFormulario(e));

    monedaSelect.addEventListener('change', (e) => leerValor(e));

    criptoSelect.addEventListener('change', (e) => leerValor(e));
}

//Funciones
function consultarCriptomonedas() {
    const url = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=5&tsym=USD";

    fetch(url) 
        .then(respuesta => respuesta.json())
        .then(datos => obtenerCriptomonedas(datos.Data))
        .then(criptoMonedas => establecerCriptomonedas(criptoMonedas))
        .catch(error => console.error(error));
}

//--//
const obtenerCriptomonedas = (criptoMonedasData) => new Promise(resolve => {
    resolve(criptoMonedasData);
});

//--//
function establecerCriptomonedas(criptoMonedas) {
    criptoMonedas.forEach(cripto => {
        const {FullName, Name} = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;

        criptoSelect.appendChild(option);
    });
}

//--//
function leerValor(e) {
    campos[e.target.name] = e.target.value;
}

//--//
function submitFormulario(e) {
    e.preventDefault();

    if(Object.values(campos).includes('')) {
        imprimirAlerta("Ambos campos son obligatorios");
        return;
    }

    consultarApi();
}

//--//
function consultarApi(){
    const {moneda, criptomoneda} = campos;
    url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

    mostrarSpinner();

    setTimeout(() => {
        fetch(url)
        .then(respuesta => respuesta.json())
        .then(datos => mostrarCotizacion(datos.DISPLAY[criptomoneda][moneda]))
        .catch(error => console.error(error));
    }, 1500)
}

//--//
function mostrarCotizacion(cotizacion) {
    limpiarHTML(resultados);

    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `
        El precio es: <span>${PRICE}</span>
    `;

    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `
        Precio más alto del día: <span>${HIGHDAY}</span>
    `;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `
        Precio más bajo del día: <span>${LOWDAY}</span>
    `;

    const variacion24hrs = document.createElement('p');
    if(Number.parseFloat(CHANGEPCT24HOUR) < 0) {
        variacion24hrs.innerHTML = `
            Variación ultimas 24 horas: <span class="negativo">${CHANGEPCT24HOUR} %</span>
        `;
    } else {
        variacion24hrs.innerHTML = `
            Variación ultimas 24 horas: <span class="positivo">+${CHANGEPCT24HOUR} %</span>
        `;
    }

    const ultimaActualizacion = document.createElement('p');
    ultimaActualizacion.innerHTML = `
        Ultima actualización: <span>${LASTUPDATE}</span>
    `;

    resultados.appendChild(precio);
    resultados.appendChild(precioAlto);
    resultados.appendChild(precioBajo);
    resultados.appendChild(variacion24hrs);
    resultados.appendChild(ultimaActualizacion);
}

//--//
function mostrarSpinner() {
    limpiarHTML(resultados);

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="dot1"></div>
        <div class="dot2"></div>
    `;

    resultados.appendChild(spinner);
}

//--//
function imprimirAlerta(mensaje) {
    const validacionDiv = document.querySelector('.error');
    validacionDiv?.remove();

    const divMensaje = document.createElement('div');
    divMensaje.classList.add('error');
    divMensaje.textContent = mensaje;

    formulario.appendChild(divMensaje);

    setTimeout(() => {
        divMensaje.remove();
    }, 2500);
}

//--//
function limpiarHTML(element) {
    while(element.firstChild) {
        element.removeChild(element.firstChild);
    }
}