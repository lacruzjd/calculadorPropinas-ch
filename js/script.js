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
    return null

}

//Listar beneficiarios
function listarBeneficiados() {
    if (beneficiados.length > 0) {
        return beneficiados
    } else {
        console.log('No hay beneficiados agregados')
        return null
    }
}

//Registro de propinas y adelantos
const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado']
const diasRegistrados = []
const propinas = []

//Eliminar el dia de la semana de diasSemana y guardarlo en dias registrados
function diaEnRegistro() {
    diasRegistrados.push(diasSemana.shift())
    return diasRegistrados[diasRegistrados.length - 1]
}

//Agregar propina
function agregarPropinas(diaSemana, monto) {
    if (!isNaN(monto)) {
        propinas.push({ diaSemana, monto })
        console.log('Monto agregado')
    } else {
        console.log('Monto no valido')
        return null
    }
}

//Listar propinas
function listarPropinas() {
    if (propinas.length > 0) {
        return propinas
    } else {
        console.log('No hay propinas registradas')
        return null
    }
}

// calcular total propinas
function totalPropinas() {
    let total = 0

    if (listarPropinas()) {
        for (const propina of propinas) {
            total += propina.monto
        }
        return total
    }
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
        return null
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

    reporte.push({ totalPropinas: totalPropinas() })
    reporte.push({ propinaPorDia: propinaPorDiaBeneficiario() })
    reporte.push({ propinaPorBeneficiadoSinDescuentos: propinaPorBeneficiadoSinDescuentos() })
    reporte.push({ propinasEntregadas: listarPropinas() })

    for (const beneficiado of beneficiados) {
        reporte.push(
            {
                id: beneficiado.id,
                nombre: beneficiado.nombre,
                diasFaltantes: beneficiado.diasFaltantes || 0,
                descuentosDiasFaltantes: beneficiado.descuentosDiasFaltantes,
                descuentosAdelantos: beneficiado.descuentosPorAdelantos,
                totalDescuentos: beneficiado.totalDescuentos,
                total: beneficiado.total
            }
        )
    }

    return reporte
}


// interfaz

const entrar = confirm('Calculadora de propinas \n ¿Deseas continuar?')

if (entrar) {
    let continuar = true

    // agregar beneficiados
    do {
        const beneficiado = prompt('Ingresa el nombre del beneficiado')
        if (beneficiado) {
            agregarBeneficiado(beneficiado)
        } else {
            continuar = false
        }
    } while (confirm('Desea agregar otro Beneficiado?'))

    //agregar propinas 
    do {
        const dia = prompt('Agregar dia')
        const monto = parseInt(prompt('Agregar monto'))

        if (dia && monto) {
            agregarPropinas(dia, monto)
        } else {
            continuar = false
        }
    } while (confirm('Desea agregar otro Dia?'))

    //agregar adelantos 
    if (confirm('Desea agregar adelantos?')) {

        do {
            const numero = parseInt(prompt('Agregar el numero del beneficiado'))
            const dia = prompt('Agregar el dia')
            const monto = parseInt(prompt('Agregar el monto'))

            if (numero && dia && monto) {
                adelantoBeneficiado(numero, dia, monto)
            } else {
                continuar = false
            }
        } while (confirm('Desea agregar otro Descuento?'))

    }

    if (confirm('Desea agregar adelantos de terceros?')) {

        do {
            const nombre = prompt('Agregar el nombre')
            const dia = prompt('Agregar el dia')
            const monto = parseInt(prompt('Agregar el monto'))

            if (nombre && dia && monto) {
                adelantoTercero(nombre, dia, monto)
            } else {
                continuar = false
            }
        } while (confirm('Desea agregar otro Descuento de terceros?'))

    }

    //Agregar dias faltantes
    if (confirm('Desea agregar dias faltantes?')) {

        do {
            const numero = parseInt(prompt('Agregar el numero del beneficiado'))
            const dias = parseInt(prompt('Agregar los dias faltantes'))

            if (numero && dias) {
                agregarDiasFalatantes(numero, dias)
            } else {
                continuar = false
            }
        } while (confirm('Desea agregar mas beneficiados con dias faltantes?'))

    }

    calcularPropinaTotal()

    console.log(reporteDistribucion())

}

// pruebas
/*
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
console.log('lista de propinas', listarPropinas())
 
adelantoBeneficiado(1, 'domingo', 50)
adelantoBeneficiado(2, 'domingo', 50)
adelantoBeneficiado(10, 'domingo', 50)
 
agregarDiasFalatantes(1, 2)
agregarDiasFalatantes(3, 2)
agregarDiasFalatantes(10, 2)
 
calcularPropinaTotal()
 
console.log('total propinas', totalPropinas())
console.log('propina por beneficiado sin descuentos', propinaPorBeneficiadoSinDescuentos())
console.log('Propina por dia beneficiado', propinaPorDiaBeneficiario())
console.log('Acumulado por dias faltantes', acumuladoDiasFaltantes())
 
console.log(reporteDistribucion())
*/