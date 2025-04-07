# Sistema de Distribución de Propinas

## Requerimientos Detallados del Sistema de Distribución de Propinas

**1. Gestión de Beneficiarios:**

- El sistema debe permitir al usuario agregar, editar y eliminar beneficiarios.
- Para cada beneficiario, se debe registrar:
  - Nombre completo.
  - Identificador único (opcional, pero recomendado).
- El sistema debe permitir la gestión de un número ilimitado de beneficiarios.

**2. Registro de Propinas y Adelantos:**

- El usuario debe poder ingresar el monto de la propina recaudada por cada día de la semana.
- El sistema debe permitir registrar adelantos de propina realizados a beneficiarios o por terceros, incluyendo:
  - Monto del adelanto.
  - Beneficiario o persona que realizó el adelanto.
  - Fecha del adelanto.

**3. Registro de Ausencias:**

- El sistema debe permitir registrar los días de ausencia de cada beneficiario.
- Se debe poder especificar el número de días faltados por cada beneficiario.

**4. Cálculo del Total de Propinas:**

- El sistema debe calcular automáticamente el total de propinas recaudadas de toda la semana.

**5. Cálculo de Propina Diaria por Beneficiario:**

- El sistema debe calcular la propina promedio por día trabajado para cada beneficiario.

**6. Descuentos por Ausencias:**

- El sistema debe calcular el monto a descontar a cada beneficiario por sus días de ausencia.
- El monto total de los descuentos por ausencia debe dividirse equitativamente entre los beneficiarios que no registraron ausencias.

**7. Descuentos por Adelantos:**

- El sistema debe descontar del monto de propina correspondiente a cada beneficiario los adelantos que haya recibido.

**8. Generación de Reporte de Distribución:**

- El sistema debe generar un reporte detallado que muestre:
  - El monto total de propinas recaudadas.
  - Los adelantos realizados y sus respectivos beneficiarios o personas.
  - Los días de ausencia de cada beneficiario.
  - El monto de propina correspondiente a cada beneficiario, incluyendo descuentos por ausencias y adelantos.
  - El monto correspondiente a los beneficiarios que no tuvieron ausencias, por el reparto equitativo de los descuentos por ausencias.
  - El monto total de propina por dia por cada beneficiario.
