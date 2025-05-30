// Obtener datos del respaldo
// Obtener datos de usuarios api
const URL = './db/beneficiados.json'

async function getApi(url, nodo, plantilla) {
    try {
        let solicitud = await fetch(url)
        let respuesta = await solicitud.json()

        respuesta.forEach(data => {
            let beneficiado = new Beneficiado()
            beneficiado.nombre = data.nombre
            beneficiado.avatar = data.avatar
            beneficiados.push(beneficiado)
            nodo.appendChild(plantilla(beneficiado))
        })
    } catch (e) {
        console.log(e)
        nodo.appendChild(error(`Error al cargar los datos ${e}`))
    }
}

//Cargar objetos Beneficiados
function procesarBeneficiados(data) {
    return data.map(beneficiadoGuardado => {
        const beneficiado = new Beneficiado()
        beneficiado.setNombre(beneficiadoGuardado.nombre)
        beneficiado.id = beneficiadoGuardado.id
        beneficiado.adelantos = beneficiadoGuardado.adelantos
        beneficiado.diasFaltantes = beneficiadoGuardado.diasFaltantes
        beneficiado.avatar = beneficiadoGuardado.avatar

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


//Cargar Datos
let propinas = getDatos('propinas', procesarPropinas) || []
let beneficiados = getDatos('beneficiados', procesarBeneficiados) || []
let resultados = JSON.parse(localStorage.getItem('resultados')) || []
let pozo = propinas.reduce((acc, propina) => acc + propina.monto, 0)
setDatos('pozo', pozo)


// INTERFAZ
// Componentes de interfaz
function seccionTemplate(seccionId, titulo, lista, inputs) {
    const seccion = document.createElement('section')
    seccion.id = seccionId
    seccion.innerHTML = `
    <div class="header">
    </div>
    <div class="lista"></div>
    <div class="inputs">
    <h2>${titulo}</h2>
    </div>
    `
    if (lista) {
        lista.forEach(li => seccion.querySelector('.lista').appendChild(li))
    }

    if (inputs) {
        inputs.forEach(input => seccion.querySelector('.inputs').appendChild(input))
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

function itemConBotonEliminar(text, accionesBoton) {
    let li = document.createElement('div')

    if (accionesBoton) {
        li.innerHTML = `${text}<button class="eliminar">x</buton>`
        li.querySelector('button').onclick = () => {
            accionesBoton()
            li.remove()
        }
    } else {
        li.innerHTML = `${text}`
    }

    return li
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

function seccionBeneficiado(beneficiado) {
    let { id, nombre, avatar, adelantos, diasFaltantes } = beneficiado
    let seccion = document.createElement('section')
    seccion.id = id
    seccion.className = 'ficha-beneficiado'
    seccion.innerHTML = `
            <div class="header">
            <img src="${avatar}"/>
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

    // Adelantos
    let adelantoItems = seccion.querySelector('.adelantos')

    adelantoItems.querySelector('.entradas').prepend(selectSemana())

    // agregar nodo por adelanto con la funcion de eliminar
    function itemAdelanto(dia, monto) {
        return itemConBotonEliminar(`${dia}: $${monto}`,
            () => {
                eliminarAdelanto(id, dia, beneficiados)
                setDatos('beneficiados', beneficiados)
            })
    }

    // Listar adelantos 
    adelantos.forEach(adelanto => {
        adelantoItems.querySelector('.lista-adelantos').appendChild(itemAdelanto(adelanto.dia, adelanto.monto))
    })

    // Agregar adelantos
    adelantoItems.querySelector('.entradas').querySelector('button').onclick = () => {
        let dia = adelantoItems.querySelector('select').value
        let monto = parseInt(adelantoItems.querySelector('.monto').value)

        dia = validar(dia, dia.trim() === '', 'Dia no Valido')
        monto = validar(monto, monto < 0 || isNaN(monto), 'Monto no Valido')

        if (dia && monto) {
            const beneficadoAdelanto = agregarAdelanto(id, dia, monto, beneficiados, pozo)
            if (beneficadoAdelanto) {
                setDatos('beneficiados', beneficiados)

                adelantoItems.querySelector('.lista-adelantos').querySelectorAll('div').forEach(item => item.remove())

                beneficadoAdelanto.adelantos.forEach(adelanto => {
                    adelantoItems.querySelector('.lista-adelantos').appendChild(itemAdelanto(adelanto.dia, adelanto.monto))
                })

                document.querySelector('#propinas').querySelector('.lista')
                
                document.querySelector('#propinas').querySelector('.lista').appendChild(itemConBotonEliminar(`Pozo: <strong>$${pozo -= monto}</strong>`, null))
                setDatos('pozo', pozo)

                adelantoItems.querySelector('.monto').value = ''
            }
            else {
                validar(null, true, `El monto debe ser menor que ${pozo}`)
            }
        }
    }

    //Dias Faltantes
    let diaItems = seccion.querySelector('.dias-faltantes')
    diaItems.querySelector('.entradas').prepend(selectSemana())

    // agregar nodo por dia con la funcion de eliminar
    function itemDia(dia) {
        return itemConBotonEliminar(dia,
            () => {
                eliminarDiaFaltante(id, dia, beneficiados)
                setDatos('beneficiados', beneficiados)
            }
        )
    }

    // Listar dias faltantes
    diasFaltantes.forEach(dia => {
        diaItems.querySelector('.lista-dias-faltantes').appendChild(itemDia(dia))
    })

    // Agregar dia faltante
    diaItems.querySelector('.entradas').querySelector('button').onclick = () => {
        let dia = diaItems.querySelector('select').value
        dia = validar(dia, dia.trim() === '', 'Ingresa un Dia Valido')
        dia = validar(dia, beneficiado.diasFaltantes.includes(dia), 'Dia ya Agregrado')

        if (dia) {
            if (agregarDiasFalatantes(id, dia, beneficiados)) {
                diaItems.querySelector('.lista-dias-faltantes').appendChild(itemDia(dia))
                setDatos('beneficiados', beneficiados)
            }
        }
    }

    //Eliminar Beneficiado
    seccion.querySelector('.eliminar-beneficiado').onclick = () => {
        beneficiados = eliminarBeneficiado(id, beneficiados)
        seccion.remove()
        setDatos('beneficiados', beneficiados)
    }

    return seccion
}

function inputsBeneficiados() {
    let div = document.createElement('div')
    div.innerHTML = `<input type="text" placeholder="Nombre"></input>
    <button id="agregar-beneficiado">Agregar</button>
    <button id="generar-resultados" class="resultados-totales">Generar Resultados</button>`

    div.querySelector('#agregar-beneficiado').onclick = () => {
        let nombre = div.querySelector('input').value

        nombre = validar(nombre, nombre.trim() === '', 'Igresa un nombre de usuario')

        if (nombre) {
            agregarBeneficiado(nombre, beneficiados)
            console.log(beneficiados)
            setDatos('beneficiados', beneficiados)
            document.querySelector('#beneficiados').querySelector('.lista').appendChild(seccionBeneficiado(beneficiados[beneficiados.length - 1]))
        }
    }

    return div
}

function seccionResultado(item) {
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

function itemPropina(dia, monto) {
    return itemConBotonEliminar(`${dia}: <strong> $${monto} </strong>`,
        () => {
            propinas = eliminarPropina(dia, propinas)
            setDatos('propinas', propinas)
        }
    )
}



function inputsPropinas() {
    let div = document.createElement('div')
    div.innerHTML = ` <input type="number" placeholder="Monto"></input>
    <button id="agregar-propinas">Agregar</button>
    <button id="nueva-semana" class="nueva-semana">Iniciar Semana</button>`

    div.prepend(selectSemana())

    div.querySelector('#agregar-propinas').onclick = () => {

        let dia = div.querySelector('select').value
        let monto = parseInt(div.querySelector('input').value)

        dia = validar(dia, dia.trim() === '', 'Ingresa un dia valido')

        monto = validar(monto, monto < 0 || isNaN(monto), 'Ingresa un monto valido')
        if (dia && monto) {
            if (agregarPropinas(dia, monto, propinas)) {
                setDatos('propinas', propinas)

                document.querySelector('#propinas').querySelector('.lista').querySelectorAll('div').forEach(e => e.remove())

                propinas.forEach(p => {
                    document.querySelector('#propinas').querySelector('.lista').appendChild(itemPropina(p.dia, p.monto))
                })

                document.querySelector('#propinas').querySelector('.lista').appendChild(itemConBotonEliminar(`Pozo: <strong>$${pozo += monto}</strong>`, null))
                setDatos('pozo', pozo)

                div.querySelector('input').value = ''

            }
        }
    }

    return div
}

//Desplegar secciones
let main = document.getElementById('app')

let secciones = [
    {
        nombre: 'Propinas',
        lista: propinas.map(item => itemPropina(item.dia, item.monto)),
        inputs: [inputsPropinas()]
    },
    {
        nombre: 'Beneficiados',
        lista: beneficiados.map(beneficiado => seccionBeneficiado(beneficiado)),
        inputs: [inputsBeneficiados()]
    },
    {
        nombre: 'Resultados',
        lista: resultados.map(resultado => seccionResultado(resultado)),
    }
]

secciones.forEach(seccion => {
    main.appendChild(seccionTemplate(seccion.nombre.toLowerCase(), seccion.nombre, seccion.lista, seccion.inputs))
})

// Obtener datos respaldados en archivo json
if (!localStorage.getItem('beneficiados')) {
    getApi(URL, document.getElementById('beneficiados').querySelector('.lista'), seccionBeneficiado)
}

//Limpiar datos para una nueva semana
document.querySelector('#nueva-semana').onclick = () => {
    beneficiados = []
    propinas = []
    resultados = []
    localStorage.clear()
    window.location.reload(true);
    window.scrollTo(0, 0);
}

//Generar los totales a entregar por beneficiado
document.querySelector('#generar-resultados').onclick = () => {
    resultados = generarTotales(beneficiados, propinas)
    setDatos('resultados', resultados)

    document.querySelector('#resultados').querySelector('.lista').innerHTML = ''

    resultados.forEach(item => {
        document.querySelector('#resultados').querySelector('.lista').appendChild(seccionResultado(item))
    })
}
document.querySelector('#propinas').querySelector('.lista').appendChild(itemConBotonEliminar(`Pozo: <strong>$${pozo}</strong>`, null))