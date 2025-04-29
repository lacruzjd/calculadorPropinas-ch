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
        if (typeof dia === 'string' && dia.trim() !== '' && typeof monto === 'number' && monto >= 0 && Propina.semana.includes(dia)) {

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
        if (typeof monto === 'number' && monto >= 0 && Propina.semana.includes(dia)) {
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
        this.totalBeneficiados = 0
        this.totaPropinasAgregadas = 0
        this.totalPropinas = 0
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

    //Establecer datos para los calculos
    setTotalesIniciales() {
        this.totalBeneficiados = this.beneficiados.length
        this.totaPropinasAgregadas = this.propinas.length
        this.totalPropinas = this.propinas.reduce((acc, propina) => acc + propina.monto, 0)
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

    //Establecer la suma de los descuentos por adelantos
    setTotalDescuentos() {
        this.beneficiados.forEach(beneficiado => {
            beneficiado.totalDescuentos = beneficiado.totalDescuentosAdelantos
        })
    }

    //Estabelcer el total de los descuentos por beneficiado
    setTotalDescuentosAdelantos() {
        this.beneficiados.forEach(beneficiado => {
            beneficiado.totalDescuentosAdelantos = beneficiado.adelantos.reduce((acc, adelanto) => acc += adelanto.monto, 0)
        })
    }

    //Establecer el monto a entregar
    setTotal() {
        beneficiados.forEach(beneficiado => {
            beneficiado.total = beneficiado.propinasEntregadasPorDia.reduce((acc, dia) => acc + dia.monto, 0)
            if (beneficiado.totalDescuentos > 0) {
                beneficiado.totalEntrega = beneficiado.total - beneficiado.totalDescuentos
            } else {
                beneficiado.totalEntrega = beneficiado.total

            }
        })
    }

    calcular() {
        this.setTotalesIniciales()
        this.setPropinasDiarias()
        this.setTotalDescuentosAdelantos()
        this.setTotalDescuentos()
        this.setTotal()

        return {
            resultados: this.beneficiados,
            estadisticaPropinas: [{
                totalRecibidas: this.totalPropinas
            }]
        }
    }

}

// Agregar beneficiado
function agregarBeneficiado(nombre) {
    if (typeof nombre === 'string' && nombre.trim() !== '') {
        console.log('agreagr')
        const beneficiado = new Beneficiado()
        beneficiado.setNombre(nombre)
        beneficiados.push(beneficiado)
        return true
    } else {
        return false
    }
}

// Obtener beneficiado por id
function obtenerBeneficiadoId(idBeneficiado) {
    let beneficiado = beneficiados.find(beneficiado => beneficiado.id === idBeneficiado)
    if (beneficiado !== undefined) {
        return beneficiado
    } else {
        return false
    }
}

// Eliminar beneficiado 
function eliminarBeneficiado(id) {
    let beneficiado = obtenerBeneficiadoId(id)

    if (beneficiado) {
        beneficiados = beneficiados.filter(beneficiado => beneficiado.id !== id)
        return true
    }
}

// Agregar adelantos
function agregarAdelanto(id, dia, monto) {
    let beneficiado = obtenerBeneficiadoId(id)

    if (beneficiado !== null && typeof dia === 'string' && typeof monto === 'number') {
        beneficiado.setAdelanto(dia, monto)
        return true
    }
}

//Eliminar Adelanto
function eliminarAdelanto(id, dia) {
    let beneficiado = obtenerBeneficiadoId(id)
    console.log(beneficiado, dia)

    if (beneficiado !== null && typeof dia === 'string' && dia.trim() !== '') {
        beneficiado.adelantos = beneficiado.adelantos.filter(adelanto => adelanto.dia !== dia)

        return true
    }
}

// Agregar dias faltantes
function agregarDiasFalatantes(id, dia) {
    let beneficiado = obtenerBeneficiadoId(id)

    if (beneficiado !== null && !beneficiado.diasFaltantes.includes(dia)) {
        beneficiado.setDiaFaltante(dia)
        return true
    }
}

//Eliminar Dias Faltantes 
function eliminarDiaFaltante(id, dia) {
    let beneficado = obtenerBeneficiadoId(id)

    if (beneficado) {
        beneficado.diasFaltantes = beneficado.diasFaltantes.filter(diaFaltante => diaFaltante !== dia)
        return true
    }
}

//Agregar propina
function agregarPropinas(diaSemana, monto) {
    if (typeof diaSemana === 'string' && diaSemana.trim() !== '' && typeof monto === 'number') {
        if (Propina.semana.includes(diaSemana.trim().toLowerCase())) {
            let propina = new Propina()

            propina.setPropina(diaSemana, monto)
            propinas.push(propina)

            return true
        }
    } else {
        return false
    }
}

function eliminarPropina(dia) {
    if (typeof dia === 'string' && dia.trim() !== '') {
        propinas = propinas.filter(propina => propina.dia !== dia)
        return true
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
function cargarBeneficiados(data) {
    return data.map(beneficiadoGuardado => {
        const beneficiado = new Beneficiado()

        beneficiado.setNombre(beneficiadoGuardado.nombre)
        beneficiado.id = beneficiadoGuardado.id
        beneficiado.adelantos = beneficiadoGuardado.adelantos
        beneficiado.diasFaltantes = beneficiadoGuardado.diasFaltantes

        return beneficiado
    })
}

//Cargar objetos Propinas
function cargarPropinas(data) {
    return data.map(valor => {
        const propina = new Propina()
        propina.setPropina(valor.dia, valor.monto)
        return propina
    })
}

// INTERFAZ
//Componente selector de dias 
function selectorDias(nombre, id) {
    return `
    <select name="${nombre}" id="${id}">
        <option value="lunes">Lunes</option>
        <option value="martes">Martes</option>
        <option value="miércoles">Miércoles</option>
        <option value="jueves">Jueves</option>
        <option value="viernes">Viernes</option>
        <option value="sábado">Sábado</option>
        <option value="domingo">Domingo</option>
    </select>`
}

function error(mensaje) {
    let errorCard = document.createElement('div')
    errorCard.className = 'error'
    errorCard.innerHTML = `
    <p><strong>${mensaje}</strong></p>
    `
    return errorCard
}

function itemPropina(id, contenido) {
    let li = document.createElement('li')
    li.className = 'propina'
    li.id = id
    li.innerHTML = contenido
    return li
}

function item(id, contenido) {
    let li = document.createElement('li')
    li.id = id
    li.innerHTML = contenido
    return li
}

// Validar 
function validar(dato, nodoRender, mensaje) {
    if (dato) {

        let errorMensaje = nodoRender.querySelector('.error')

        if (errorMensaje) {
            errorMensaje.remove()
        }
        console.log(dato)
        return dato
    } else {
        let errorMensaje = nodoRender.querySelector('.error')

        if (errorMensaje) {
            errorMensaje.remove()
        }

        nodoRender.appendChild(error(mensaje))
        return null
    }
}

const render = document.getElementById('app')

// ***Seccion Beneficiados***
let beneficiados = getDatos('beneficiados', cargarBeneficiados) || []

const beneficiadosSection = document.getElementById('beneficiados')
beneficiadosSection.innerHTML = `
<section id="lista-beneficiados"></section>
<div class="entradas">
<h2>Beneficiados<h2/>
    <input type="text" id="input-beneficiado-nombre" placeholder="Nombre" required>
    <button id="agregar-beneficiado">Agregrar</button>
    <br>
    <button id="respaldar-beneficiados" class="respaldar">Respaldar</button>
    <button id="borrar-beneficiados" class="respaldar">Borrar Resplado</button>
</div>
`

function cardBeneficiado(beneficiado) {

    let id = beneficiado.id
    let cardBeneficiado = document.createElement('div')

    cardBeneficiado.id = `${id}`
    cardBeneficiado.className = 'ficha-beneficiado'
    cardBeneficiado.innerHTML = `
        <div class="nombre">
            <h4>${beneficiado.nombre}</h4>
            <button class="eliminar" function="eliminar-beneficiado" id-beneficiado="${id}" >Eliminar</button>
        </div>
        <div class="adelantos">
            <h3>Adelantos</h3>
            <ul id="lista-adelantos-${id}">
            ${beneficiado.adelantos.map(adelanto => {
        return `<li>${adelanto.dia}: $${adelanto.monto}<button class="eliminar" function="eliminar-adelanto" id-beneficiado="${id}" dia="${adelanto.dia}">Eliminar</button></li>`
    }).join('')}
            </ul>
            <div class="entradas">
                <p>Agregar Adelantos</p>
                ${selectorDias('adelantos')}
                <input type="number" id="agregar-adelanto-monto${id}" placeholder="Monto" min = 1 required><br>
                <button function="agregar-adelanto" id-beneficiado="${id}">+ Adelanto</button>
            </div>
        </div>
            <div class="dias-faltantes" >
            <h3>Dias Faltantes</h3>
            <ul id="lista-dias-faltantes-${id}">
            ${beneficiado.diasFaltantes.map(diaFaltante => {
        return `<li>${diaFaltante}<button class="eliminar" function="eliminar-dia-faltante" id-beneficiado="${id}" dia="${diaFaltante}">Eliminar</button></li>`
    }).join('')}
            </ul>
            <div class="entradas">
                <p>Agregar dias Faltantes</p>
                 ${selectorDias('dia-faltante')}
                 <button function="agregar-dia-faltante" id-beneficiado="${id}">+ Dia</button>
            </div>
            </div>
        </div>
        `

    return cardBeneficiado
}

const listaBeneficiados = document.getElementById('lista-beneficiados')

beneficiados.forEach(beneficiado => {
    listaBeneficiados.appendChild(cardBeneficiado(beneficiado))
})

function cargarEventosFichaBeneficiado() {
    const botones = document.querySelector(`#lista-beneficiados`).querySelectorAll('button')

    botones.forEach(boton => {
        let id = parseInt(boton.getAttribute('id-beneficiado'))

        //Eliminar Beneficiado
        if (boton.getAttribute('function') === 'eliminar-beneficiado') {
            boton.onclick = () => {
                eliminarBeneficiado(id)
                boton.parentElement.parentElement.remove()
            }
        }

        //Agregar Adelanto
        if (boton.getAttribute('function') === 'agregar-adelanto') {
            boton.onclick = () => {
                let dia = boton.parentElement.querySelector('select').value
                let monto = boton.parentElement.querySelector('input').value

                monto = validar(parseInt(monto), boton.parentElement, 'Monto no valido!')
                console.log(id, dia, monto)
                if (dia && monto) {
                    agregarAdelanto(id, dia, monto)
                    boton.parentElement.parentElement.querySelector('ul').appendChild(item(null, `${dia}: $${monto}<button class="eliminar" function="eliminar-adelanto" id-beneficiado="${id}" dia="${dia}">Eliminar</button>`))

                    cargarEventosFichaBeneficiado()
                }

                boton.parentElement.querySelector('select').value = ''
                boton.parentElement.querySelector('input').value = ''
            }
        }

        //Eliminar Adelanto
        if (boton.getAttribute('function') === 'eliminar-adelanto') {
            boton.onclick = () => {
                console.log(id)
                eliminarAdelanto(id, boton.getAttribute('dia'))
                boton.parentElement.remove()
            }
        }

        //Agregar Dia
        if (boton.getAttribute('function') === 'agregar-dia-faltante') {
            boton.onclick = () => {
                let dia = boton.parentElement.querySelector('select').value
                if (dia) {

                    let agregado = agregarDiasFalatantes(id, dia)

                    agregado = validar(agregado, boton.parentElement, 'Dia ya Agregado')

                    if (agregado) {
                        boton.parentElement.parentElement.querySelector('ul').appendChild(item(null, `${dia}<button class="eliminar" function="eliminar-dia-faltante" id-beneficiado="${id}" dia="${dia}">Eliminar</button>`))

                        cargarEventosFichaBeneficiado()
                    }

                    boton.parentElement.querySelector('select').value = ''


                }
            }
        }

        //Eliminar Dia Faltante
        if (boton.getAttribute('function') === 'eliminar-dia-faltante') {
            boton.onclick = () => {
                eliminarDiaFaltante(id, boton.getAttribute('dia'))

                boton.parentElement.remove()
            }
        }
    })
}

cargarEventosFichaBeneficiado()

// Agregar Beneficiado 
const agregarBeneficiadoBtn = document.getElementById('agregar-beneficiado')
agregarBeneficiadoBtn.onclick = () => {
    let nombre = document.getElementById('input-beneficiado-nombre').value
    nombre = nombre.trim()

    nombre = validar(nombre, agregarBeneficiadoBtn.parentElement, 'Ingresar Nombre!')

    if (nombre) {
        agregarBeneficiado(nombre)
        console.log(beneficiados, nombre)

        listaBeneficiados.appendChild(cardBeneficiado(beneficiados[beneficiados.length - 1]))

        cargarEventosFichaBeneficiado()
    }
}

// Respaldar Beneficiados
const respaldarBeneficiadosBtn = document.getElementById('respaldar-beneficiados')
respaldarBeneficiadosBtn.onclick = () => {
    setDatos('beneficiados', beneficiados)
}

//Borrar Propinas
const borrarBeneficiadosBtn = document.getElementById('borrar-beneficiados')
borrarBeneficiadosBtn.onclick = () => {
    localStorage.removeItem('beneficiados')
    beneficiados = []
    document.getElementById('lista-beneficiados').innerHTML = ''
}

// ***Seccion Propinas***
let propinas = getDatos('propinas', cargarPropinas) || []

const propinasSection = document.getElementById('propinas')
propinasSection.innerHTML = `
<div id="lista-propinas"></div>
<div class="entradas">
<h2>Propinas</h2>
    ${selectorDias('dia', 'propina')}
    <input type="number" id="input-propina-monto" min = 1 placeholder="Monto" required>
    <button id="agregar-propina">Agregrar</button>
    <br>
    <button id="respaldar-propinas" class="respaldar">Respaldar</button>    
    <button id="borrar-propinas" class="respaldar">Borrar Resplado</button>
</div>

`
function cardPropina(propina) {
    let propinadiv = document.createElement('div')
    propinadiv.className = 'propina'
    propinadiv.innerHTML = `
    <h3>${propina.dia}</h3>
    <p>$${propina.monto}</p>
    <button id="${propina.dia}" class="eliminar">Eliminar</button>`

    return propinadiv
}

if (propinas) {
    propinas.forEach(propina => {
        console.log(propina)
        document.getElementById('lista-propinas').appendChild(cardPropina(propina))
    })
}

function eventoEliminarPropina() {
    const botones = document.querySelector('#lista-propinas').querySelectorAll('button')
    botones.forEach(boton => {
        boton.onclick = () => {
            eliminarPropina(boton.id)
            console.log(boton.id)
            boton.parentElement.remove()
        }
    })
}

eventoEliminarPropina()

// Agregar Propinas
const agregarPropinaBtn = document.getElementById('agregar-propina')
agregarPropinaBtn.onclick = () => {
    let dia = document.getElementById('propina').value
    let monto = document.getElementById('input-propina-monto').value


    monto = validar(monto, agregarPropinaBtn.parentElement, 'Monto no valido!')

    if (dia && monto) {
        agregarPropinas(dia, parseInt(monto))
        document.getElementById('lista-propinas').appendChild(itemPropina(null, `<h3>${dia}</h3>
        <p>${monto}</p>
        <button id="${dia}" class="eliminar">Eliminar</button>
        </li>`))

        eventoEliminarPropina()
    }

    document.getElementById('input-propina-monto').value = ''
}

//Respaldar Propinas
const respaldarPropinaBtn = document.getElementById('respaldar-propinas')
respaldarPropinaBtn.onclick = () => {
    setDatos('propinas', propinas)
}

//Borrar Propinas
const borrarPropinaBtn = document.getElementById('borrar-propinas')
borrarPropinaBtn.onclick = () => {
    localStorage.removeItem('propinas')
    propinas = []
    document.getElementById('lista-propinas').innerHTML = ''
}

//***Seccion Reporte***
let reporte = localStorage.getItem('reporte') || []

const seccionReporte = document.getElementById('reporte')
seccionReporte.id = 'reporte'
seccionReporte.innerHTML = `
<section id="lista-reportes"></section>
<div class="entradas">
<h2>Reporte<h2/>
<button class="respaldar" id="generar-reporte">Generar Reporte</button>
    <br>
</div>`

function cardReporte(beneficiado) {
    let fichaBeneficiadoReporte = document.createElement('div')

    fichaBeneficiadoReporte.className = 'ficha-beneficiado'
    fichaBeneficiadoReporte.id = beneficiado.id

    fichaBeneficiadoReporte.innerHTML = `
            <h4>${beneficiado.nombre}</h4>
            <p>Descuentos: $${beneficiado.totalDescuentos}</p>
            <p>Total: <strong>$${beneficiado.totalEntrega}</strong></p>
            `
    return fichaBeneficiadoReporte
}

//Mostrar Reporte
function cardseccionReporte(reporte) {
    reporte.estadisticaPropinas.forEach(estadistica => {
        let p = document.createElement('p')
        p.innerHTML = `Total Propinas: ${estadistica.totalRecibidas}`

        document.getElementById('lista-reportes').appendChild(p)
    })

    reporte.resultados.forEach(beneficiado => {
        document.getElementById('lista-reportes').appendChild(cardReporte(beneficiado))
    })
}

seccionReporte.querySelector('button').onclick = () => {
    console.log(propinas, beneficiados)

    if (beneficiados.length > 0 && propinas.length > 0) {
        document.getElementById('lista-reportes').innerHTML = ''
        reporte = generarTotales(beneficiados, propinas)

        cardseccionReporte(reporte)
    } else {
        document.getElementById('lista-reportes').innerHTML = ''

    }
}

render.appendChild(seccionReporte)

/*
// pruebas
agregarBeneficiado('jose')
agregarBeneficiado('David')
agregarBeneficiado('Luis')
agregarBeneficiado('Carlos')
agregarBeneficiado('juan')
agregarBeneficiado('Perro')
agregarBeneficiado('')
agregarBeneficiado(' ')
agregarBeneficiado(6)

eliminarBeneficiado(6)

agregarAdelanto(1, 'viernes', 50)

agregarDiasFalatantes(1, 'lunes')
agregarDiasFalatantes(1, 'martes')


agregarDiasFalatantes(2, 'martes')
agregarDiasFalatantes(2, 'viernes')

agregarDiasFalatantes(3, 'miercoles')
agregarDiasFalatantes(3, 'viernes')

agregarDiasFalatantes(4, 'miercoles')
agregarDiasFalatantes(4, 'viernes')

agregarDiasFalatantes(5, 'miercoles')
agregarDiasFalatantes(5, 'viernes')

agregarDiasFalatantes('5', 'miercols')
agregarDiasFalatantes('h', 5)

agregarPropinas('lunes', 400)
agregarPropinas('martes', 600)
agregarPropinas('miercoles', 300)
agregarPropinas('jueves', 500)
agregarPropinas('viernes', 400)

agregarPropinas('vierne', '400')
agregarPropinas('viernes', '400')

console.log(propinas)
console.log(beneficiados)

console.log(generarTotales())
console.log(generarTotales())
*/