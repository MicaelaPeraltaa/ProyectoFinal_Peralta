// Esperar a que se cargue el DOM antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function () {

    // Funciones para manipular los datos de la app
    function calcularTotalGastos(gastos) {
        let total = 0;
        for (const gasto of gastos) {
            total += gasto.monto;
        }
        return total;
    }

    // Funciones para generar y manipular el DOM
    function actualizarListaGastos(gastos) {
        const listaGastos = document.getElementById('listaGastos');

        // Limpia la lista de gastos actual
        listaGastos.innerHTML = '';

        // Agrega los nuevos elementos a la lista
        for (let i = 0; i < gastos.length; i++) {
            const listItem = document.createElement('li');
            listItem.textContent = `${gastos[i].descripcion}: $${gastos[i].monto}`;

            // Agrega un botón para eliminar el gasto
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar';
            deleteButton.addEventListener('click', () => {
                eliminarGasto(i);
            });
            listItem.appendChild(deleteButton);

            listaGastos.appendChild(listItem);
        }
    }

    function actualizarTotalGastos(gastos) {
        const totalGastos = document.getElementById('totalGastos');
        const total = calcularTotalGastos(gastos);

        // Muestra el total de gastos
        totalGastos.textContent = `Total de gastos: $${total}`;
    }

    // Estructura de datos clara basada en Arrays y Objetos
    let gastos = [];

    // Cargar datos desde un archivo JSON
    fetch('datos_simulados.json')
        .then(response => response.json())
        .then(data => {
            // Asigna los datos cargados a la variable de gastos
            gastos = data;

            // Actualiza la lista de gastos y el total
            actualizarListaGastos(gastos);
            actualizarTotalGastos(gastos);
        })
        .catch(error => {
            console.error('Error al cargar los datos:', error);
        });

    // Eventos para responder a la interacción del usuario
    const formularioGastos = document.getElementById('formularioGastos');
    formularioGastos.addEventListener('submit', function (event) {
        event.preventDefault();

        const descripcion = document.getElementById('descripcion').value;
        const monto = parseFloat(document.getElementById('monto').value);

        if (!descripcion || isNaN(monto)) {
            mostrarError("Por favor, completa todos los campos correctamente.");
            return;
        }

        const gasto = {
            descripcion,
            monto
        };

        gastos.push(gasto);

        formularioGastos.reset();

        actualizarListaGastos(gastos);
        actualizarTotalGastos(gastos);
    });

    // Función para eliminar un gasto específico
    function eliminarGasto(index) {
        if (index >= 0 && index < gastos.length) {
            gastos.splice(index, 1);
            actualizarListaGastos(gastos);
            actualizarTotalGastos(gastos);
        }
    }

    // Obtén una referencia al elemento canvas
    const ctx = document.getElementById('miGrafico').getContext('2d');

    // Datos de ejemplo (reemplázalos con tus datos reales)
    const datos = {
        labels: ['Alimentación', 'Transporte', 'Entretenimiento', 'Otros'],
        datasets: [{
            label: 'Gastos por categoría',
            data: [300, 150, 200, 100], // Datos de gastos por categoría
            backgroundColor: ['#FF5733', '#33FF57', '#3366FF', '#FF33E9'], // Colores de las barras
        }]
    };

    // Crea una instancia de Chart.js
    const miGrafico = new Chart(ctx, {
        type: 'bar', // Tipo de gráfico (barra en este caso)
        data: datos,
        options: {
            scales: {
                y: {
                    beginAtZero: true // Comienza el eje Y desde cero
                }
            }
        }
    });

});
