//Gestion de beneficiados
class Beneficiado {
    static sumarId = 1
    static totalBeneficiados = 1
    constructor() {
        Beneficiado.totalBeneficiados++
        this.id = Beneficiado.sumarId++
        this.nombre = null
        this.adelantos = []
        this.diasFaltantes = []
    }

    setNombre(nombre) {
        if (typeof nombre === 'string' && nombre.trim() !== '') {
            this.nombre = nombre
        } else {
            return null
        }
    }

    setAdelanto(dia, monto) {
        if (typeof dia === 'string' && dia.trim() !== '' && typeof monto === 'number' && monto > 0 && Propina.semana.includes(dia)) {

            if (!this.adelantos.some(adelanto => adelanto.dia === dia)) {
                this.adelantos.push({ dia, monto })

                return true
            }

            this.adelantos.forEach(adelanto => {
                if (adelanto.dia === dia) {
                    adelanto.monto += monto
                }
            })

            return true

        } else {
            return false
        }
    }

    setDiaFaltante(dia) {
        if (typeof dia === 'string' && dia.trim() !== '' && !this.diasFaltantes.includes(dia)) {
            this.diasFaltantes.push(dia)
        } else {
            return null
        }
    }
}
class Propina {
    static semana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
    constructor() {
        this.dia = null
        this.monto = 0
    }

    setPropina(dia, monto) {
        if (typeof monto === 'number' && monto > 0 && Propina.semana.includes(dia)) {
            this.dia = dia
            this.monto = monto
        } else {
            return null
        }
    }
}
class CalculadorTotal {
    constructor() {
        this.beneficiados = []
        this.propinas = []
    }

    setBeneficiados(beneficados) {
        if (Array.isArray(beneficados)) {
            this.beneficiados = beneficados
        }
    }

    setPropinas(propinas) {
        if (Array.isArray(propinas)) {
            this.propinas = propinas
        }
    }


    //Asigna el monto de las propinas diarias a los asistentes
    setPropinasDiarias() {
        this.beneficiados.forEach(beneficiado => {
            beneficiado.propinasEntregadasPorDia = []
        })

        this.propinas.forEach(propina => {

            const asistentes = this.beneficiados.filter(beneficiado => !beneficiado.diasFaltantes.includes(propina.dia))

            let totalAsistentes = asistentes.length
            let monto = propina.monto / totalAsistentes

            asistentes.forEach(beneficiado => {
                beneficiado.propinasEntregadasPorDia.push({ dia: propina.dia, monto })
            })
        })
    }

    //Estabelcer el total de los descuentos por beneficiado
    setTotalDescuentosAdelantos() {
        this.beneficiados.forEach(beneficiado => {
            beneficiado.totalDescuentosAdelantos = beneficiado.adelantos.reduce((acc, adelanto) => acc += adelanto.monto, 0)
        })
    }

    //Establecer la suma de los descuentos por adelantos
    setTotalDescuentos() {
        this.beneficiados.forEach(beneficiado => {
            beneficiado.totalDescuentos = beneficiado.totalDescuentosAdelantos
        })
    }

    //Establecer el monto a entregar
    setTotal() {
        this.beneficiados.forEach(beneficiado => {
            beneficiado.total = beneficiado.propinasEntregadasPorDia.reduce((acc, dia) => acc + dia.monto, 0)
            if (beneficiado.totalDescuentos > 0) {
                beneficiado.totalEntrega = beneficiado.total - beneficiado.totalDescuentos
            } else {
                beneficiado.totalEntrega = beneficiado.total

            }
        })
    }

    calcular() {
        this.setPropinasDiarias()
        this.setTotalDescuentosAdelantos()
        this.setTotalDescuentos()
        this.setTotal()

        return {
            resultados: this.beneficiados,
            estadisticaPropinas: [{
                totalRecibidas: propinas.reduce((acc, propina) => acc + propina.monto, 0)
            }]
        }
    }
}

// Agregar beneficiado
function agregarBeneficiado(nombre, lista) {
    if (typeof nombre === 'string' && nombre.trim() !== '') {
        const beneficiado = new Beneficiado()
        beneficiado.setNombre(nombre)
        lista.push(beneficiado)
        return true
    } else {
        return false
    }
}

// Obtener beneficiado por id
function obtenerBeneficiadoId(idBeneficiado, lista) {
    let beneficiado = lista.find(beneficiado => beneficiado.id === idBeneficiado)
    if (beneficiado) {
        return beneficiado
    } else {
        return false
    }
}

// Eliminar beneficiado 
function eliminarBeneficiado(id, lista) {
    let beneficiado = obtenerBeneficiadoId(id, lista)

    if (beneficiado) {
        return lista = lista.filter(beneficiado => beneficiado.id !== id)
    }
}

// Agregar adelantos
function agregarAdelanto(id, dia, monto, lista) {
    let beneficiado = obtenerBeneficiadoId(id, lista)

    if (beneficiado !== null && typeof dia === 'string' && typeof monto === 'number') {
        beneficiado.setAdelanto(dia, monto)
        return true
    }
}

//Eliminar Adelanto
function eliminarAdelanto(id, dia, lista) {
    let beneficiado = obtenerBeneficiadoId(id, lista)

    if (beneficiado !== null && typeof dia === 'string' && dia.trim() !== '') {
        beneficiado.adelantos = beneficiado.adelantos.filter(adelanto => adelanto.dia !== dia)
        return true
    }
}

// Agregar dias faltantes
function agregarDiasFalatantes(id, dia, lista) {
    let beneficiado = obtenerBeneficiadoId(id, lista)

    if (beneficiado !== null && !beneficiado.diasFaltantes.includes(dia)) {
        beneficiado.setDiaFaltante(dia)
        return true
    }
}

//Eliminar Dias Faltantes 
function eliminarDiaFaltante(id, dia, lista) {
    let beneficado = obtenerBeneficiadoId(id, lista)

    if (beneficado) {
        beneficado.diasFaltantes = beneficado.diasFaltantes.filter(diaFaltante => diaFaltante !== dia)
        return true
    }
}

//Agregar propina
function agregarPropinas(diaSemana, monto, lista) {
    if (typeof diaSemana === 'string' && diaSemana.trim() !== '' && typeof monto === 'number') {
        if (Propina.semana.includes(diaSemana.trim().toLowerCase())) {
            let propina = new Propina()
            propina.setPropina(diaSemana, monto)
            lista.push(propina)
            return lista
        }
    } else {
        return false
    }
}

//Eliminar Propina
function eliminarPropina(dia, lista) {
    if (typeof dia === 'string' && dia.trim() !== '') {
        return lista = lista.filter(propina => propina.dia !== dia)
    }
    return false
}

//Generar totales
function generarTotales(beneficados, propinas) {
    let calculadorPropina = new CalculadorTotal()

    calculadorPropina.setBeneficiados(beneficados)
    calculadorPropina.setPropinas(propinas)

    // retorna un array con los totales
    return calculadorPropina.calcular()
}

//Obtener datos de localstorage
function getDatos(key, procesarDatos) {
    let datosGuardados = JSON.parse(localStorage.getItem(key))

    if (datosGuardados) {
        return procesarDatos(datosGuardados)
    }
}

//Guardar Datos en Localstorage
function setDatos(key, data) {
    if (data) {
        localStorage.setItem(key, JSON.stringify(data))
    }

    return false
}

//Cargar objetos Beneficiados
function procesarBeneficiados(data) {
    return data.map(beneficiadoGuardado => {
        const beneficiado = new Beneficiado()

        beneficiado.setNombre(beneficiadoGuardado.nombre)
        beneficiado.id = beneficiadoGuardado.id
        beneficiado.adelantos = beneficiadoGuardado.adelantos
        beneficiado.diasFaltantes = beneficiadoGuardado.diasFaltantes
        beneficiado.img = beneficiadoGuardado.img

        return beneficiado
    })
}

//Cargar objetos Propinas
function procesarPropinas(data) {
    return data.map(valor => {
        const propina = new Propina()
        propina.setPropina(valor.dia, valor.monto)
        return propina
    })
}


// INTERFAZ
function seccionTemplate(titulo) {
    const seccion = document.createElement('seccion')
    seccion.innerHTML = `
    <div class="header">
        <h2>${titulo}</h2>
    </div>
    <div class="lista"></div>
    <div class="inputs"></div>
    `
    return seccion
}

function seccionBeneficiado(beneficiado) {
    let { id, nombre, img, adelantos, diasFaltantes } = beneficiado
    let seccion = document.createElement('section')
    seccion.id = id
    seccion.className = 'ficha-beneficiado'
    seccion.innerHTML = `
            <div class="header">
            <img src="${img}"/>
            <h3>${nombre}</h3>
            <button class="eliminar-beneficiado eliminar">x</button>
            </div>
            <div class="adelantos">
                <h4>Adelantos</h4>
                <div class="lista-adelantos"></div>
                <div class="entradas">
                    <input type="number" placeholder="Monto" class="monto"></input>
                    <button>Agregar</button>
                </div>
            </div>
            <div class="dias-faltantes">
                <h4>Faltas</h4>
                <div class="lista-dias-faltantes"></div>
                <div class="entradas">
                    <button>Agregar</button>
                </div>
            </div>
            `
    let adelantoItems = seccion.querySelector('.adelantos')

    // Listar adelantos
    adelantos.forEach(adelanto => {
        adelantoItems.querySelector('.lista-adelantos').appendChild(itemAdelanto(adelanto.dia, adelanto.monto))
    })

    function itemAdelanto(dia, monto) {
        let itemAdelanto = item(`${dia}: $${monto}<button class="eliminar">x</button>`, [
            () => eliminarAdelanto(id, dia, beneficiados),
            () => respaldar()
        ])

        respaldar()
        return itemAdelanto
    }

    adelantoItems.querySelector('.entradas').prepend(selectSemana())

    adelantoItems.querySelector('.entradas').querySelector('button').onclick = () => {

        let dia = adelantoItems.querySelector('select').value
        let monto = parseInt(adelantoItems.querySelector('.monto').value)

        dia = validar(dia, dia.trim() === '', 'Dia no Valido')
        monto = validar(monto, monto < 0 || monto !== NaN, 'Monto no Valido')

        if (dia && monto) {
            agregarAdelanto(id, dia, monto, beneficiados)
            adelantoItems.querySelector('.lista-adelantos').appendChild(itemAdelanto(dia, monto))
        }
    }

    //agregar dias faltantes
    function itemDiaFaltante(dia) {
        let itemDia = item(`${dia} <button class="eliminar">x</button>`, [
            () => eliminarDiaFaltante(id, dia, beneficiados),
            () => respaldar()
        ])

        respaldar()
        return itemDia
    }

    let diaItems = seccion.querySelector('.dias-faltantes')

    diaItems.querySelector('.entradas').prepend(selectSemana())

    diasFaltantes.forEach(dia => {
        diaItems.querySelector('.lista-dias-faltantes').appendChild(itemDiaFaltante(dia))
    })

    diaItems.querySelector('.entradas').querySelector('button').onclick = () => {
        let dia = diaItems.querySelector('select').value

        dia = validar(dia, dia.trim() === '', 'Dia no Valido')

        if (dia) {
            if (agregarDiasFalatantes(id, dia, beneficiados)) {
                diaItems.querySelector('.lista-dias-faltantes').appendChild(itemDiaFaltante(dia))
            }
        }
    }

    //Eliminar Beneficiado
    seccion.querySelector('.eliminar-beneficiado').onclick = () => {
        beneficiados = eliminarBeneficiado(id, beneficiados)
        seccion.remove()
        respaldar()
    }

    return seccion
}

function selectSemana() {
    const dias = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    const select = document.createElement('select')

    dias.forEach(dia => {
        const opcion = document.createElement("option")
        opcion.value = dia.toLowerCase()
        opcion.textContent = dia
        select.appendChild(opcion)
    })

    return select
}

function seccionInput(id, className, inputs) {
    let seccion = document.createElement('section')
    seccion.id = id
    seccion.className = className
    seccion.innerHTML = inputs

    return seccion
}

function item(text, accionesBoton) {
    let li = document.createElement('div')
    li.innerHTML = text

    li.querySelector('button').onclick = () => {
        accionesBoton.forEach(accion => accion())
        li.remove()
    }
    return li
}

function itemPropina(dia, monto) {
    let itemPropina = item(`<p>${dia} <strong>$${monto}</strong></p> <button class="eliminar">x</buton>`, [
        () => propinas = eliminarPropina(dia, propinas),
        () => setDatos('propinas', propinas)
    ])

    setDatos('propinas', propinas)
    return itemPropina
}

function error(mensaje) {
    let errorCard = document.createElement('div')
    errorCard.className = 'error'
    errorCard.innerHTML = `
    <p><strong>${mensaje}</strong></p>
    `
    return errorCard
}

function validar(dato, validacion, mensaje) {
    if (validacion) {
        Toastify({
            text: mensaje,
            duration: 4000,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "center", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                color: "black",
                background: "linear-gradient(to right,rgb(124, 224, 212),rgb(61, 159, 201))",
                borderRadius: "10px"
            },
            onClick: function () { } // Callback after click
        }).showToast();

        return null

    } else {
        return dato
    }
}

function itemTotal(item) {
    let totalEntrega = Math.floor(item.totalEntrega)
    let totalDescuentos = Math.floor(item.totalDescuentos)

    let div = document.createElement('div')
    div.id = item.id
    div.className = 'ficha-beneficiado'

    div.innerHTML = `
            <div class="header">
                <h3>${item.nombre}</h3>
                <p>Total: <strong>$${totalEntrega}</strong></p>
            </div>
            <div class="resultados">
                <p>Descuentos: $${totalDescuentos}</p>
                <span>Propina Entregada <input type="checkbox"></input></span>
            </div>
                `
    if (item.entregada) {
        div.querySelector('input[type="checkbox"]').checked = true
    }

    div.querySelector('input[type="checkbox"]').onclick = () => {
        item.entregada = true
        localStorage.setItem('resultados', JSON.stringify(resultados))
    }

    return div
}

function respaldar() {
    setDatos('beneficiados', beneficiados)
}

//Obtener Datos de Localstorage
let beneficiados = getDatos('beneficiados', procesarBeneficiados) || []
let propinas = getDatos('propinas', procesarPropinas) || []
let resultados = JSON.parse(localStorage.getItem('resultados')) || []

// Obtener datos de usuarios api
// const URL = 'https://randomuser.me/api/?results=10&seed=miclaveSecreta'
const URL = './db/beneficiados.json'

async function getApi(url, nodo, plantilla) {
    try {
        let solicitud = await fetch(url)
        let respuesta = await solicitud.json()
        console.log(respuesta)

        respuesta.forEach(data => {
            let beneficiado = new Beneficiado()
            beneficiado.nombre = data.nombre
            beneficiado.img = data.img
            beneficiados.push(beneficiado)
            nodo.appendChild(plantilla(beneficiado))
        })
    } catch (e) {
        console.log(e)
        nodo.appendChild(error(`Error al cargar los datos ${e}`))
    }
}

let secciones = document.querySelectorAll('section')
secciones.forEach(seccion => {
    seccion.appendChild(seccionTemplate(seccion.id.charAt(0).toUpperCase() + seccion.id.slice(1)
    ))

    if (seccion.id === 'propinas') {

        //listar propinas
        propinas.forEach(propina => {
            seccion.querySelector('.lista').appendChild(itemPropina(propina.dia, propina.monto))
        })

        //Agregar propinas 
        seccion.querySelector('.inputs').appendChild(seccionInput(null, 'entradas', `
            <input type="number" placeholder="Monto"></input>
            <button id="agregar-propinas">Agregar</button>
        `))

        seccion.querySelector('.entradas').prepend(selectSemana())

        seccion.querySelector('.entradas').querySelector('#agregar-propinas').onclick = () => {

            let dia = seccion.querySelector('select').value
            let monto = parseInt(seccion.querySelector('input[type="number"]').value)

            dia = validar(dia, dia.trim() === '', 'Ingresa un dia valido')
            console.log(monto)
            monto = validar(monto, monto < 0 || monto !== NaN, 'Ingresa un monto valido')

            if (dia && monto) {
                if (agregarPropinas(dia, monto, propinas)) {
                    seccion.querySelector('.lista').appendChild(itemPropina(dia, monto))
                }
            }
        }
    }

    //Seccion Beneficiados
    if (seccion.id === 'beneficiados') {

        //obtener beneficiados
        if (beneficiados.length === 0) {
            getApi(URL, seccion.querySelector('.lista'), seccionBeneficiado)
        }

        //Listar Beneficiados
        beneficiados.forEach(beneficiado => {
            seccion.querySelector('.lista').appendChild(seccionBeneficiado(beneficiado))
        })

        //Agregar Beneficado 
        seccion.querySelector('.inputs').appendChild(seccionInput(null, 'entradas', `
            <input type="text"></input>
            <button id="agregar-beneficiado">Agregar</button>
        `))

        let agregarBeneficiadoBtn = seccion.querySelector('#agregar-beneficiado')
        agregarBeneficiadoBtn.onclick = () => {

            let nombre = agregarBeneficiadoBtn.parentElement.querySelector('input').value

            nombre = validar(nombre, nombre.trim() === '', 'Nombre no Valido')

            if (nombre) {
                agregarBeneficiado(nombre, beneficiados)
                seccion.querySelector('.lista').appendChild(seccionBeneficiado(beneficiados[beneficiados.length - 1]))
                respaldar()
            }
        }
    }

    if (seccion.id === 'resultados') {
        console.log(resultados)
        if (resultados.length > 0) {
            resultados.resultados.forEach(item => {
                seccion.querySelector('.lista').appendChild(itemTotal(item))
            })
        }
    }
})

document.querySelector('#nueva-semana').onclick = () => {
    beneficiados = []
    propinas = []
    localStorage.clear()

    document.querySelector('#beneficiados').querySelector('.lista').querySelectorAll('section').forEach(section => section.remove())
    getApi(URL, document.querySelector('#beneficiados').querySelector('.lista'), seccionBeneficiado)

    document.querySelector('#propinas').querySelector('.lista').querySelectorAll('div').forEach(item => item.remove())

    document.querySelector('#resultados').querySelector('.lista').querySelectorAll('div').forEach(item => item.remove())

}

document.querySelector('#generar-reporte').onclick = () => {
    resultados = generarTotales(beneficiados, propinas)

    console.log('guardar reporer')
    localStorage.setItem('resultados', JSON.stringify(resultados))

    let items = document.querySelector('#resultados').querySelector('.lista').querySelectorAll('div')
    items.forEach(item => item.remove())

    resultados.resultados.forEach(item => {
        document.querySelector('#resultados').querySelector('.lista').appendChild(itemTotal(item))
    })
}