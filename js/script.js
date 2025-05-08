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
function agregarBeneficiado(nombre) {
    if (typeof nombre === 'string' && nombre.trim() !== '') {
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
    if (beneficiado) {
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

//Eliminar Propina
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
function procesarBeneficiados(data) {
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
function procesarPropinas(data) {
    return data.map(valor => {
        const propina = new Propina()
        propina.setPropina(valor.dia, valor.monto)
        return propina
    })
}

// INTERFAZ
//Componente selector de dias 

function seccionTemplate(titulo) {
    const seccion = document.createElement('seccion')
    seccion.innerHTML = `
    <div class="lista"></div>
    <div class="inputs">
    <h2>${titulo}</h2>
    </div>
    `
    return seccion
}

function seccionInput(id, className, inputs) {
    let seccion = document.createElement('section')
    seccion.id = id
    seccion.className = className
    seccion.innerHTML = inputs

    return seccion
}

function item(text) {
    let li = document.createElement('li')
    li.innerHTML = text

    return li
}


function error(mensaje) {
    let errorCard = document.createElement('div')
    errorCard.className = 'error'
    errorCard.innerHTML = `
    <p><strong>${mensaje}</strong></p>
    `
    return errorCard
}

function seccionBeneficiado(beneficiado) {
    console.log(beneficiado)
    let {id, nombre, adelantos, diasFaltantes} = beneficiado
    let seccion = document.createElement('section')
    seccion.id = id
    seccion.className = 'ficha-beneficiado'

    seccion.innerHTML = `
    <h3>${nombre}</h3>
    <button>x</button>
    <ul class="adelantos"></ul>
    <ul class="dias-faltantes"></ul>
    `
    adelantos.forEach(adelanto => {
        seccion.querySelector('.adelantos').appendChild(item(`${adelanto.dia}: ${adelanto.monto}`))
    })

    diasFaltantes.forEach(dia => {
        seccion.querySelector('.dias-faltantes').appendChild(item(`${dia}`))
    })

    return seccion
}

let secciones = document.querySelectorAll('section')

secciones.forEach(seccion => {
    seccion.appendChild(seccionTemplate(seccion.id.charAt(0).toUpperCase() + seccion.id.slice(1)
    ))

    if (seccion.id === 'beneficiados') {

        const beneficados = getDatos('beneficiados', procesarBeneficiados) || []

        beneficados.forEach(beneficiado => {
            seccion.querySelector('.lista').appendChild(seccionBeneficiado(beneficiado))
        })
        
        seccion.querySelector('.inputs').appendChild(seccionInput(null, 'entradas', `
            <input type="text"></input>
            <button>Agregar</button>
        `))

        let agregarBeneficiadoBtn = seccion.querySelector('.inputs button')

        console.log(seccion)
        agregarBeneficiadoBtn.onclick = () => {

            let nombre = agregarBeneficiadoBtn.parentElement.querySelector('input').value 

            nombre = validar(nombre, nombre.trim() === '', seccion, 'Nombre no Valido')
            console.log(nombre )

        }
    }

})




