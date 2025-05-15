//Gestion de beneficiados
class Beneficiado {
    static sumarId = 1
    static totalBeneficiados = 1
    constructor() {
        Beneficiado.totalBeneficiados++
        this.id = Beneficiado.sumarId++
        this.nombre = null
        this.avatar = null
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

        return this.beneficiados
    }
}

// Agregar beneficiado
function agregarBeneficiado(nombre, lista) {
    if (typeof nombre === 'string' && nombre.trim() !== '') {
        const beneficiado = new Beneficiado()
        beneficiado.setNombre(nombre)
        beneficiado.avatar = `https://robohash.org/${nombre}`
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