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

function item(text, accionesBoton) {
    let li = document.createElement('li')
    li.innerHTML = text

    li.querySelector('button').onclick = () => {
        accionesBoton.forEach(accion => accion())
        li.remove()
    }
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

// Validar 
function validar(dato, validacion, nodoRender, mensaje) {
    if (validacion) {
        let errorMensaje = nodoRender.querySelector('.error')

        if (errorMensaje) errorMensaje.remove()
        nodoRender.appendChild(error(mensaje))

        return null

    } else {
        let errorMensaje = nodoRender.querySelector('.error')

        if (errorMensaje) errorMensaje.remove()

        return dato
    }
}

//obtener beneficiados
let beneficados = getDatos('beneficiados', procesarBeneficiados) || []

//Obtener propinas
let propinas = getDatos('propinas', procesarPropinas) || []


let secciones = document.querySelectorAll('section')
secciones.forEach(seccion => {
    seccion.appendChild(seccionTemplate(seccion.id.charAt(0).toUpperCase() + seccion.id.slice(1)
    ))

    //Seccion Beneficiados
    if (seccion.id === 'beneficiados') {

        function respaldar() {
            setDatos('beneficiados', beneficados)
        }

        function seccionBeneficiado(beneficiado) {
            let { id, nombre, adelantos, diasFaltantes } = beneficiado
            let seccion = document.createElement('section')

            seccion.id = id
            seccion.className = 'ficha-beneficiado'
            seccion.innerHTML = `
            <h3>${nombre}</h3>
            <button class="eliminar-beneficiado">x</button>
            <ul class="adelantos">
                <h4>Adelantos</h4>
                <ul></ul>
                <div class="entradas">
                <input type="text" placeholder="Dia" class="dia"></input>
                <input type="number" placeholder="Monto" class="monto"></input>
                    <button>Agregar</button>
                </div>
            </ul>
            <ul class="dias-faltantes">
                <h4>Faltas</h4>
                <ul></ul>
                <div class="entradas">
                    <input type="text" placeholder="Dia"></input>
                    <button>Agregar</button>
                </div>
            </ul>
            `

            let adelantoItems = seccion.querySelector('.adelantos')

            //agregar adelantos

            // Listar adelantos
            adelantos.forEach(adelanto => {
                adelantoItems.querySelector('ul').appendChild(itemAdelanto(adelanto.dia, adelanto.monto))
            })

            function itemAdelanto(dia, monto) {
                let itemAdelanto = item(`${dia}: ${monto}<button>x</button>`, [
                    () => eliminarAdelanto(id, dia, beneficados),
                    () => respaldar()
                ])

                respaldar()
                return itemAdelanto
            }

            adelantoItems.querySelector('.entradas').querySelector('button').onclick = () => {
                let dia = adelantoItems.querySelector('.dia').value
                let monto = parseInt(adelantoItems.querySelector('.monto').value)

                dia = validar(dia, dia.trim() === '', adelantoItems, 'Dia no Valido')
                monto = validar(monto, monto < 0 || monto === NaN, adelantoItems, 'Monto no Valido')

                if (dia && monto) {
                    agregarAdelanto(id, dia, monto, beneficados)
                    adelantoItems.querySelector('ul').appendChild(itemAdelanto(dia, monto))
                }
            }

            //agregar dias faltantes
            function itemDiaFaltante(dia) {
                let itemDia = item(`${dia} <button>x</button>`, [
                    () => eliminarDiaFaltante(id, dia, beneficados),
                    () => respaldar()
                ])

                respaldar()
                return itemDia
            }

            let diaItems = seccion.querySelector('.dias-faltantes')

            diasFaltantes.forEach(dia => {
                diaItems.querySelector('ul').appendChild(itemDiaFaltante(dia))
            })

            diaItems.querySelector('.entradas').querySelector('button').onclick = () => {
                let dia = diaItems.querySelector('input').value

                dia = validar(dia, dia.trim() === '', diaItems, 'Dia no Valido')

                if (dia) {
                    if (agregarDiasFalatantes(id, dia, beneficados)) {
                        diaItems.querySelector('ul').appendChild(itemDiaFaltante(dia))
                    }
                }
            }

            //Eliminar Beneficiado
            seccion.querySelector('.eliminar-beneficiado').onclick = () => {
                beneficados = eliminarBeneficiado(id, beneficados)
                seccion.remove()
                respaldar()
            }

            return seccion
        }

        //Listar Beneficiados
        beneficados.forEach(beneficiado => {
            seccion.querySelector('.lista').appendChild(seccionBeneficiado(beneficiado))
        })

        //Agregar Beneficado 
        seccion.querySelector('.inputs').appendChild(seccionInput(null, 'entradas', `
            <input type="text"></input>
            <button>Agregar</button>
        `))

        let agregarBeneficiadoBtn = seccion.querySelector('.inputs button')
        agregarBeneficiadoBtn.onclick = () => {

            let nombre = agregarBeneficiadoBtn.parentElement.querySelector('input').value

            nombre = validar(nombre, nombre.trim() === '', seccion, 'Nombre no Valido')

            if (nombre) {
                agregarBeneficiado(nombre, beneficados)
                seccion.querySelector('.lista').appendChild(seccionBeneficiado(beneficados[beneficados.length - 1]))
                respaldar()
            }
        }

    }

    if (seccion.id === 'propinas') {

        function itemPropina(dia, monto) {
            let itemPropina = item(`${dia}: $ ${monto} <button>x</buton>`, [
                () => propinas = eliminarPropina(dia, propinas),
                () => setDatos('propinas', propinas)
            ])

            setDatos('propinas', propinas)
            return itemPropina
        }

        //listar propinas
        propinas.forEach(propina => {
            seccion.querySelector('.lista').appendChild(itemPropina(propina.dia, propina.monto))
        })

        //Agregar propinas 
        seccion.querySelector('.inputs').appendChild(seccionInput(null, 'entradas', `
            <input type="text" ></input>
            <input type="number" placeholder="Monto"></input>
            <button>Agregar</button>
        `))

        seccion.querySelector('.entradas').querySelector('button').onclick = () => {

            let dia = seccion.querySelector('input[type="text"]').value
            let monto = parseInt(seccion.querySelector('input[type="number"]').value)

            dia = validar(dia, dia.trim() === '', seccion.querySelector('.entradas'), 'Ingresa un dia valido')
            monto = validar(monto, monto < 0 || monto === NaN, seccion.querySelector('.entradas'), 'Ingresa un monto valido')

            if (dia && monto) {
                if (agregarPropinas(dia, monto, propinas)) {
                    seccion.querySelector('.lista').appendChild(itemPropina(dia, monto))
                }
            }
        }

    }

    if (seccion.id === 'reporte') {
        let reporte = JSON.parse(localStorage.getItem('reporte')) || []

        function itemTotal(item) {
            let div = document.createElement('div')
            div.className = 'ficha-beneficiado'

            div.innerHTML = `
                <h3>${item.nombre}</h3>
                <p>Descuentos: ${item.totalDescuentos}</p>
                <p>Total: ${item.totalEntrega}</p>
                `
            return div
        }

        //Listar Reporte Guardado
        reporte.resultados.forEach(item => {
            seccion.querySelector('.lista').appendChild(itemTotal(item))
        })


        //Generar Reporte
        seccion.querySelector('.inputs').appendChild(seccionInput(null, 'entradas', `<button>Generar Reporte</button>`))

        seccion.querySelector('.entradas').querySelector('button').onclick = () => {
            reporte = generarTotales(beneficados, propinas)
            localStorage.setItem('reporte', JSON.stringify(reporte))

            let items = seccion.querySelector('.lista').querySelectorAll('div')
            items.forEach(item => item.remove())

            console.log(reporte)
            reporte.resultados.forEach(item => {
                seccion.querySelector('.lista').appendChild(itemTotal(item))
            })
        }
    }
})
