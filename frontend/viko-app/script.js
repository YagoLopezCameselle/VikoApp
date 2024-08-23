document.addEventListener('DOMContentLoaded', function() {
    const apiUrl = 'http://localhost:5000/tweets';

    async function fetchTweets() {
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching tweets:', error);
        }
    }

    function populateTable(tweets) {
        const tableBody = document.querySelector('#tweets-table tbody');
        tableBody.innerHTML = '';

        tweets.forEach(tweet => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tweet.user}</td>
                <td>${tweet.text}</td>
                <td>${new Date(tweet.created_at).toLocaleDateString()}</td>
                <td>${tweet.sentiment}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    function renderCharts(tweets) {
        const sentimentData = { positive: 0, neutral: 0, negative: 0 };
        const datesData = {};

        tweets.forEach(tweet => {
            const sentiment = tweet.sentiment;
            const date = new Date(tweet.created_at).toLocaleDateString();

            sentimentData[sentiment] = (sentimentData[sentiment] || 0) + 1;

            if (!datesData[date]) {
                datesData[date] = 0;
            }
            datesData[date]++;
        });

        const barChartData = {
            labels: ['Positivo', 'Neutral', 'Negativo'],
            datasets: [{
                label: 'Sentimiento de los tweets',
                data: [sentimentData['positive'], sentimentData['neutral'], sentimentData['negative']],
                backgroundColor: ['#b9fabb', '#83a6ff', '#f16f52']
            }]
        };

        const pieChartData = {
            labels: ['Positivo', 'Neutral', 'Negativo'],
            datasets: [{
                data: [sentimentData['positive'], sentimentData['neutral'], sentimentData['negative']],
                backgroundColor: ['#b9fabb', '#83a6ff', '#f16f52']
            }]
        };

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

    fetchTweets().then(tweets => {
        if (tweets && tweets.length > 0) {
            populateTable(tweets);
            renderCharts(tweets);
        } else {
            document.querySelector('#tweets-container').innerHTML = '<p>No se encontraron tweets.</p>';
        }
    });
});
