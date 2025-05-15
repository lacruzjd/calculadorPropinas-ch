<style>
.derecha{
    float: right
}

.center {
 width: 300px
}

div {
    margin: 40px
}
.manual2, .centro {
    margin: 40px;
    display: flex;
    flex-direction: column;
    text-align: center
}

.centro {
    flex-direction: row;
    align-items: center
}
.top{
    flex-basis: 100%
}

a {
    margin: 10px;
    padding: 10px;
    border-radius: 10px;
    border: none;
    width: 4rem;
    background-color: rgb(208, 210, 210);
    color: rgb(96, 96, 96);
    font-weight: bold
}

a:hover {
    color: black;
    text-decoration: none;
    background-color: aquamarine;
}

</style>

# Calculador de Propinas

El programa permitira al usuario agregar la propina diaria y entre quienes sera repartida asi como calcular el total a entregar, permitira registrar los adelantos y los dias que falto algun trabajador, asi como la opcion de seleccionar a quien fue hecha la entrega de la misma

[Acceda al Calculador aqui](https://lacruzjd.github.io/calculadorPropinas-ch/)

## Instrucciones de uso:

<div class="manual">
Agregar propina diaria
<img src="./docs/img/propinas.png">
Iniciar nueva semana limpia todos los datos ingresados, propinas, adelantos, dias faltantes y resultados
</div>

<div class="manual">
<img src="./docs/img/elimiar-propina.png"><br>
Boton para eliminar propina.
</div>

<div class="manual2">
<span class="top">Boton para Eliminar Benefiado</span>
<div class="centro">
    <span class="izquierda">Agregar Adelantos</span>
    <img class="center"  src="./docs/img/ficha-beneficado.png"><br>
    <span >Eliminar item</span>
</div>
<span class="top">Agregar dias faltantes</span>
</div>


<div>
Boton para agregar benefiado
<img src="./docs/img/beneficiado.png"/>
<span class="derecha">Boton para generar los totales </span>
</div>

<div>
<br>
<img src="./docs/img/entregada.png"/>
Selector para indicar que propina fue entregada
</div>




