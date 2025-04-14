//Gestion de beneficiados
const beneficiados = []
const terceros = []

//Agregar beneficiado
function agregarBeneficiado(nombre) {
    beneficiados.push({ id: beneficiados.length + 1, nombre })
    console.log(`Agregado ${nombre}`)
}

// Obtener beneficiado por id
function obtenerBeneficiadoId(idBeneficiado) {
    for (const beneficiado of beneficiados) {
        if (beneficiado.id === idBeneficiado) {
            return beneficiado
        }
    }
    console.log('Beneficiado No encontrado')
}

//PROPINAS
//Registro de propinas y adelantos
const propinas = [{ dia: 'domingo', monto: 0 }, { dia: 'lunes', monto: 0 }, { dia: 'martes', monto: 0 }, { dia: 'miercoles', monto: 0 }, { dia: 'jueves', monto: 0 }, { dia: 'viernes', monto: 0 }, { dia: 'sabado', monto: 0 }]

//Agregar propina
function agregarPropinas(diaSemana, monto) {
    if (typeof monto === 'number') {
        for (const propina of propinas) {
            if (propina.dia === diaSemana.toLowerCase()) {
                propina.monto += monto
                break
            }
        }
        return console.log('Monto agregado')
    } else {
        return console.log('Monto o dia no valido')
    }
}

//Calcular total propinas
function totalPropinas() {
    let total = 0
    for (const propina of propinas) {
        total += propina.monto
    }
    return total
}

function estadisticaPropinas() {
    let total = totalPropinas()
    let proppinaIndividuaSinDescuentos = 0
    let propinaPorDia = 0

    if (total > 0 && beneficiados.length > 0) {
        proppinaIndividuaSinDescuentos = total / beneficiados.length
        propinaPorDia = (total / 7) / beneficiados.length
    }

    return {
        total, proppinaIndividuaSinDescuentos, propinaPorDia
    }
}

//Calcular el total de propina para cada beneficiado sin descuentos
function agregartotalPropinaSinDescuentos() {
    for (const beneficiado of beneficiados) {
        beneficiado.totalPropinaSinDescuentos = estadisticaPropinas().proppinaIndividuaSinDescuentos
    }
}

//Agregar adelantos
function adelantoBeneficiado(id, diaSemana, monto) {
    let beneficiado = obtenerBeneficiadoId(id)

    if (beneficiado && typeof monto === 'number') {
        beneficiado.adelantos = []
        beneficiado.adelantos.push({ diaSemana, monto })
        console.log('Monto agregado')
    } else {
        console.log('Numero de beneficiario no valido')
    }
}


//Agregar adelanto a un tercero
function adelantoTercero(nombre, diaAdelanto, monto) {
    terceros.push({ nombre, diaAdelanto, monto })
    console.log('Monto agregado')
}

//Agregar dias faltantes
function agregarDiasFalatantes(id, dias) {
    let beneficiado = obtenerBeneficiadoId(id)

    if (beneficiado && typeof dias === 'number') {
        beneficiado.diasFaltantes = dias
        console.log('Dias faltantes agregados')
    } else {
        console.log('Numero de beneficiario o  cantidad de dias invalidos')
    }
}


//Descuento por adelantos 

//Acumulado de descuentos por dias faltantes
let acumuladoDiasFaltantes = 0

function asignarDescuetos() {
    for (const beneficiado of beneficiados) {
        if (beneficiado.adelantos && beneficiado.diasFaltantes) {
            for (const adelanto of beneficiado.adelantos) {
                beneficiado.descuentosPorAdelantos = 0
                beneficiado.descuentosDiasFaltantes = 0
                beneficiado.descuentosPorAdelantos += adelanto.monto
                beneficiado.descuentosDiasFaltantes = estadisticaPropinas().propinaPorDia * beneficiado.diasFaltantes
                acumuladoDiasFaltantes = + beneficiado.descuentosDiasFaltantes
            }
        } else {
            beneficiado.descuentosPorAdelantos = 0
            beneficiado.descuentosDiasFaltantes = 0
        }
    }
}

//Sumar los descuentos
function totalizarDescuentos() {
    for (const beneficiado of beneficiados) {
        if (beneficiado.descuentosPorAdelantos || beneficiado.descuentosDiasFaltantes) {
            beneficiado.totalDescuentos = 0

            if (beneficiado.descuentosPorAdelantos) {
                beneficiado.totalDescuentos += beneficiado.descuentosPorAdelantos
            }

            if (beneficiado.descuentosDiasFaltantes) {
                beneficiado.totalDescuentos += beneficiado.descuentosDiasFaltantes
            }
        }
        else {
            beneficiado.totalDescuentos = 0
        }
    }
}

//Aplicar Descuentos
function aplicarDescuentos() {
    for (const beneficiado of beneficiados) {
        if (beneficiado.totalDescuentos > 0) {
            beneficiado.totalPropinaConDescuentos = beneficiado.totalPropinaSinDescuentos - beneficiado.totalDescuentos
        }
        else {
            beneficiado.totalPropinaConDescuentos = 0
        }
    }
}

//Sumar el acumulado por ausencia entre los que no faltaron
function repartirAcumuladoDiasFaltantes() {
    const acumuladoDescuentos = acumuladoDiasFaltantes
    let beneficiadoSinFaltas = 0

    for (const beneficiado of beneficiados) {
        if (beneficiado.diasFaltantes) {
            beneficiadoSinFaltas++
        }
    }

    for (const beneficiado of beneficiados) {
        if (!beneficiado.diasFaltantes) {
            beneficiado.total = beneficiado.totalPropinaSinDescuentos + (acumuladoDescuentos / beneficiadoSinFaltas) - beneficiado.totalDescuentos

        } else {
            beneficiado.total = beneficiado.totalPropinaConDescuentos
        }
    }
}

function calcularPropinaTotal() {
    agregartotalPropinaSinDescuentos()
    asignarDescuetos()
    totalizarDescuentos()
    aplicarDescuentos()
    repartirAcumuladoDiasFaltantes()
}

//Generar reporte de la distribucion del la propina
function reporteDistribucion() {
    let reporte = []

    reporte.push({ metadata: estadisticaPropinas() })
    reporte.push({ diasEntregados: propinas })
    reporte.push({ totales: beneficiados })

    return reporte
}



// interfaz
const entrar = confirm('Calculadora de propinas \n ¿Deseas continuar?')

if (entrar) {

    //Generar lista de beneficiados agregados
    function generalista() {
        let lista = 'Beneficiados Agregados:\n'
        for (const beneficiado of beneficiados) {
            lista += `Nro: ${beneficiado.id}. Nombre: ${beneficiado.nombre}\n`
        }
        return lista
    }

    //Agregar beneficiados
    function agregarBeneficiadoInterfaz() {

        do {
            const beneficiado = prompt(`Ingresa el nombre del beneficiado`)
            if (beneficiado) {
                agregarBeneficiado(beneficiado)
            }
        } while (confirm(`${generalista()}\nDesea agregar otro Beneficiado?`))


    }

    //Agregar propinas
    function agregarPropinasInterfaz() {
        do {
            const dia = prompt('Agregar dia')
            const monto = parseInt(prompt(`Agregar monto`)) || 0

            if (dia && monto) {
                agregarPropinas(dia, monto)
            }
        } while (confirm(`${listarPropinas()}\nDesea agregar otro Dia?`))
    }

    //agregar adelantos 
    function agregarAdelantosInterfaz(mensaje, grupo) {
        do {
            const numero = parseInt(prompt(`${mensaje} \n${generalista() || ''}`))
            const dia = prompt(`Agregar el dia`)
            const monto = parseInt(prompt('Agregar el monto')) || 0

            if (numero && dia && monto) {
                grupo(numero, dia, monto)
            }
        } while (confirm('Desea agregar otro Adelanto?'))
    }

    //Agregar dias faltantes
    function agregarDiasFaltantesInterfaz() {
        do {
            const numero = parseInt(prompt(`Agregar el numero del beneficiado \n ${generalista()}`))
            const dias = parseInt(prompt('Agregar los dias faltantes')) || 0

            if (numero && dias) {
                agregarDiasFalatantes(numero, dias)
            }
        } while (confirm('Desea agregar mas beneficiados con dias faltantes?'))
    }

    //Generar Reporte 
    function generarReporte() {
        calcularPropinaTotal()

        const reporte = reporteDistribucion()
        console.log(reporte)

        let beneficiadoInforme = ''

        for (const beneficiado of reporte[1]) {
            beneficiadoInforme += `
        -----------------------------
        Beneficiado: ${beneficiado.nombre}
        Dias faltantes: ${beneficiado.diasFaltantes}
        Descuentos por adelantos: ${beneficiado.descuentosAdelantos}
        Descuentos por dias faltantes: ${beneficiado.descuentosDiasFaltantes}
        Total de descuentos: ${beneficiado.totalDescuentos}
        Total a pagar: ${beneficiado.total}
        -----------------------------
        `
        }

        alert(`
        REPORTE:
        Total de propinas: ${reporte[0][0].totalPropinas}
        Propina por dia: ${reporte[0][1].propinaPorDia}
        Propina por beneficiado sin descuentos: ${reporte[0][2].propinaPorBeneficiadoSinDescuentos}

        Beneficiados: ${beneficiadoInforme}
        `)
    }

    //Menu
    let continuar = true

    //Opciones del menu 
    const opciones = ' 1. Agregar beneficiado\n 2. Agregar propinas\n 3. Agregar adelantos\n 4. Agregar adelantos de terceros\n 5. Agregar dias faltantes\n 6. Generar reporte\n 7. Salir'

    do {
        switch (prompt(opciones)) {
            case '1':
                agregarBeneficiadoInterfaz()
                break
            case '2':
                agregarPropinasInterfaz()
                break
            case '3':
                agregarAdelantosInterfaz("Seleccina el numero del Beneficiado", adelantoBeneficiado)
                break
            case '4':
                agregarAdelantosInterfaz("Ingresa el nombre del tercero", adelantoTercero)
                break
            case '5':
                agregarDiasFaltantesInterfaz()
                break
            case '6':
                generarReporte()
                break
            case '7':
                continuar = false
                break
            default:
                alert('Opcion no valida')
                break
        }

    } while (continuar)
}
/*

// pruebas

agregarBeneficiado('jose')
agregarBeneficiado('David')
agregarBeneficiado('Luis')
agregarBeneficiado('Carlos')

console.log(beneficiados)

console.log(obtenerBeneficiadoId(1))
console.log(obtenerBeneficiadoId(2))
console.log(obtenerBeneficiadoId(3))
console.log(obtenerBeneficiadoId(10))

agregarPropinas('domingo', 100)
agregarPropinas('lunes', 100)
agregarPropinas('martes', 100)
agregarPropinas('miercoles', 100)
agregarPropinas('jueves', 100)
agregarPropinas('viernes', 100)
agregarPropinas('sabado', 200)
console.log('estadisticas', estadisticaPropinas())

adelantoBeneficiado(1, 'domingo', 50)
adelantoBeneficiado(2, 'domingo', 50)

agregarDiasFalatantes(1, 2)
agregarDiasFalatantes(3, 2)
agregarDiasFalatantes(10, 2)

calcularPropinaTotal()

console.log(reporteDistribucion())
*/