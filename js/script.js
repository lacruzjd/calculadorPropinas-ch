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
    console.log('Beneficiado no encontrado')
}

//Listar beneficiarios
function listarBeneficiados() {
    if (beneficiados.length > 0) {
        return beneficiados
    } else {
        console.log('No hay beneficiados agregados')
    }
}

//Registro de propinas y adelantos
const propinas = [{ dia: 'domingo', monto: 0 }, { dia: 'lunes', monto: 0 }, { dia: 'martes', monto: 0 }, { dia: 'miercoles', monto: 0 }, { dia: 'jueves', monto: 0 }, { dia: 'viernes', monto: 0 }, { dia: 'sabado', monto: 0 }]

//Agregar propina
function agregarPropinas(diaSemana, monto) {
    if (!isNaN(monto)) {
        for (const propina of propinas) {
            if (propina.dia === diaSemana.toLowerCase()) {
                propina.monto = monto
            }
        }
        console.log('Monto agregado')
        console.log(propinas)
    } else {
        console.log('Monto no valido')
    }
}

//Listar propinas
function obtenerPropinas() {
    return propinas
}

// calcular total propinas
function totalPropinas() {
    let total = 0
    for (const propina of propinas) {
        total += propina.monto
    }
    return total
}

//dividir propina entre los beneficiados sin descuentos 
function propinaPorBeneficiadoSinDescuentos() {
    const total = totalPropinas()

    if (total) {
        const propinaPorBeneficiado = total / beneficiados.length
        return propinaPorBeneficiado
    }
}

// Calcular el monto promedio de propina por dia dividiendo el total de la propina entre 7 dias 
// y luego dividirlo entre los beneficiados
function propinaPorDiaBeneficiario() {
    return propinaPorBeneficiadoSinDescuentos() / 7
}

//Agregar adelanto a beneficiado
function adelantoBeneficiado(id, diaSemana, monto) {

    let beneficiado = obtenerBeneficiadoId(id)

    if (beneficiado) {
        beneficiado.adelantos = []
        beneficiado.adelantos.push({ diaSemana, monto })
        console.log('Monto agregado')
    }

}

//Agregar adelanto a un tercero
function adelantoTercero(nombre, diaAdelanto, monto) {
    terceros.push({ nombre, diaAdelanto, monto })
    console.log('Monto agregado')
}

//Listar terceros
function listarTerceros() {
    if (terceros.length > 0) {
        return terceros
    } else {
        console.log('No hay terceros registrados')
    }
}

//Agregar dias faltantes
function agregarDiasFalatantes(id, dias) {
    let beneficiado = obtenerBeneficiadoId(id)

    if (beneficiado) {
        beneficiado.diasFaltantes = dias
    }
    console.log('Dias faltantes agregados')
}

//Descuento por adelantos 
function descuentosPorAdelantos() {
    for (const beneficiado of beneficiados) {
        if (beneficiado.adelantos) {
            for (const adelanto of beneficiado.adelantos) {
                beneficiado.descuentosPorAdelantos = 0
                beneficiado.descuentosPorAdelantos += adelanto.monto
            }
        } else {
            beneficiado.descuentosPorAdelantos = 0
        }

    }
}

// Descuento por ausencias
function descuentosPorDiasFaltantes() {
    const propinaDia = propinaPorDiaBeneficiario()

    for (const beneficiado of beneficiados) {
        if (beneficiado.diasFaltantes) {
            beneficiado.descuentosDiasFaltantes = 0
            beneficiado.descuentosDiasFaltantes = propinaDia * beneficiado.diasFaltantes
        } else {
            beneficiado.descuentosDiasFaltantes = 0
        }
    }
}

//Acumulado de descuento por ausencias
function acumuladoDiasFaltantes() {
    let acumulado = 0
    for (const beneficiado of beneficiados) {
        if (beneficiado.descuentosDiasFaltantes) {
            acumulado += beneficiado.descuentosDiasFaltantes
        }
    }

    return acumulado
}

//Sumar los descuentos
function totalDescuentos() {
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

//Calcular el total de propina para cada beneficiado sin descuentos
function agregartotalPropinaSinDescuentos() {
    for (const beneficiado of beneficiados) {
        beneficiado.totalPropinaSinDescuentos = propinaPorBeneficiadoSinDescuentos()
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
    const acumuladoDescuentos = acumuladoDiasFaltantes()
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
    console.log('beneficiadoSinFaltas', beneficiadoSinFaltas)

}

function calcularPropinaTotal() {
    agregartotalPropinaSinDescuentos()
    descuentosPorAdelantos()
    descuentosPorDiasFaltantes()
    totalDescuentos()
    aplicarDescuentos()
    repartirAcumuladoDiasFaltantes()
}

//Generar reporte de la distribucion del la propina
function reporteDistribucion() {
    let reporte = []
    let metaData = []
    let totales = []

    metaData.push({ totalPropinas: totalPropinas() || 0 })
    metaData.push({ propinaPorDia: propinaPorDiaBeneficiario() || 0 })
    metaData.push({ propinaPorBeneficiadoSinDescuentos: propinaPorBeneficiadoSinDescuentos() || 0 })
    metaData.push({ propinasEntregadas: obtenerPropinas() || 0 })

    for (const beneficiado of beneficiados) {
        totales.push(
            {
                id: beneficiado.id,
                nombre: beneficiado.nombre,
                diasFaltantes: beneficiado.diasFaltantes || 0,
                descuentosDiasFaltantes: beneficiado.descuentosDiasFaltantes || 0,
                descuentosAdelantos: beneficiado.descuentosPorAdelantos || 0,
                totalDescuentos: beneficiado.totalDescuentos || 0,
                total: beneficiado.total || 0
            }
        )
    }
    reporte.push(metaData)
    reporte.push(totales)

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

    //Generar lista de propinas agregadas
    function generalistaDiasPropinas() {
        let lista = 'Propinas Agregadas:\n'
        for (const propina of propinas) {
            lista += `Dia: ${propina.dia.toUpperCase()}. Monto: ${propina.monto}\n`
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
            const monto = parseInt(prompt(`Agregar monto`))

            if (dia && monto) {
                agregarPropinas(dia, monto)
            }
        } while (confirm(`${generalistaDiasPropinas()}\nDesea agregar otro Dia?`))
    }

    //agregar adelantos 
    function agregarAdelantosInterfaz() {
        do {
            const numero = parseInt(prompt(`Agregar el numero del beneficiado \n${generalista()}`))
            const dia = prompt(`Agregar el dia`)
            const monto = parseInt(prompt('Agregar el monto')) || 0

            if (numero && dia && monto) {
                adelantoBeneficiado(numero, dia, monto)
            }
        } while (confirm('Desea agregar otro Adelanto?'))
    }

    function agregarAdelantosTercerosInterfaz() {
        do {
            const nombre = prompt('Agregar el nombre')
            const dia = prompt('Agregar el dia')
            const monto = parseInt(prompt('Agregar el monto'))

            if (nombre && dia && monto) {
                adelantoTercero(nombre, dia, monto)
            }
        } while (confirm('Desea agregar otro Adelanto de terceros?'))

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
                agregarAdelantosInterfaz()
                break
            case '4':
                agregarAdelantosTercerosInterfaz()
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

adelantoBeneficiado(1, 'domingo', 50)
adelantoBeneficiado(2, 'domingo', 50)

agregarDiasFalatantes(1, 2)
agregarDiasFalatantes(3, 2)
agregarDiasFalatantes(10, 2)

calcularPropinaTotal()

console.log(reporteDistribucion())
*/