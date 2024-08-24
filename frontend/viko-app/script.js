document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://localhost:5000/tweets'; // URL de la API para obtener los tweets

    // Función asíncrona para obtener los tweets desde la API
    async function fetchTweets() {
        try {
            const response = await fetch(apiUrl); // Realiza la petición a la API
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json(); // Devuelve los datos en formato JSON
        } catch (error) {
            console.error('Error fetching tweets:', error); // Manejo de errores
        }
    }

    // Función para llenar la tabla con los tweets obtenidos
    function populateTable(tweets) {
        const tableBody = document.querySelector('#tweets-table tbody');
        tableBody.innerHTML = ''; // Limpia la tabla antes de llenarla

        tweets.forEach(tweet => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tweet.user}</td> <!-- Usuario que publicó el tweet -->
                <td>${tweet.text}</td> <!-- Texto del tweet -->
                <td>${new Date(tweet.created_at).toLocaleDateString()}</td> <!-- Fecha del tweet -->
                <td>${tweet.sentiment}</td> <!-- Sentimiento del tweet -->
            `;
            tableBody.appendChild(row); // Agrega la fila a la tabla
        });
    }

    // Función para renderizar los gráficos basados en los datos de los tweets
    function renderCharts(tweets) {
        const sentimentData = { positive: 0, neutral: 0, negative: 0 }; // Contadores de sentimiento
        const datesData = {}; // Contador de tweets por fecha

        // Procesa los tweets para contar los sentimientos y fechas
        tweets.forEach(tweet => {
            const sentiment = tweet.sentiment;
            const date = new Date(tweet.created_at).toLocaleDateString();

            sentimentData[sentiment] = (sentimentData[sentiment] || 0) + 1;

            if (!datesData[date]) {
                datesData[date] = 0;
            }
            datesData[date]++;
        });

        // Datos para el gráfico de barras
        const barChartData = {
            labels: ['Positivo', 'Neutral', 'Negativo'],
            datasets: [{
                label: 'Sentimiento de los tweets',
                data: [sentimentData['positive'], sentimentData['neutral'], sentimentData['negative']],
                backgroundColor: ['#b9fabb', '#83a6ff', '#f16f52']
            }]
        };

        // Datos para el gráfico circular (Pie chart)
        const pieChartData = {
            labels: ['Positivo', 'Neutral', 'Negativo'],
            datasets: [{
                data: [sentimentData['positive'], sentimentData['neutral'], sentimentData['negative']],
                backgroundColor: ['#b9fabb', '#83a6ff', '#f16f52']
            }]
        };

        // Datos para el gráfico de línea
        const lineChartData = {
            labels: Object.keys(datesData),
            datasets: [{
                label: 'Tweets a lo largo del tiempo',
                data: Object.values(datesData),
                fill: false,
                borderColor: '#42a5f5',
                tension: 0.1
            }]
        };

        // Configuración del gráfico de barras
        new Chart(document.getElementById('barChart').getContext('2d'), {
            type: 'bar',
            data: barChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false, // Evita que se distorsione el gráfico
                scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true }
                }
            }
        });

        // Configuración del gráfico circular (Pie chart)
        new Chart(document.getElementById('pieChart').getContext('2d'), {
            type: 'pie',
            data: pieChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false, // Evita que se distorsione el gráfico
            }
        });

        // Configuración del gráfico de línea
        new Chart(document.getElementById('lineChart').getContext('2d'), {
            type: 'line',
            data: lineChartData,
            options: {
                responsive: true,
                scales: {
                    x: { beginAtZero: true },
                    y: { beginAtZero: true }
                }
            }
        });
    }

    // Fetch de los tweets y renderizado de la tabla y gráficos
    fetchTweets().then(tweets => {
        if (tweets && tweets.length > 0) {
            populateTable(tweets); // Llenar la tabla con tweets
            renderCharts(tweets); // Renderizar los gráficos
        } else {
            document.querySelector('#tweets-container').innerHTML = '<p>No se encontraron tweets.</p>';
        }
    });
});

