# VikoApp

VikoApp es una aplicación que he desarrollado con un backend en Python y un frontend en HTML y JavaScript. A continuación, detallo las partes principales del proyecto:

## Backend
- **Extracción de tweets:** Para obtener los tweets, he implementado un scraper utilizando la librería `twint` en lugar de la API de Twitter, ya que esta última es de pago.
- El análisis de sentimiento se realiza con la herramienta VADER, dado que `MonkeyLearn` no estaba disponible en este caso.
- **Base de datos:** Los datos se almacenan en MongoDB, dado que es una solución sencilla y eficiente para los datos que queremos manejar.
- **API:** He creado una API utilizando Flask que permite realizar peticiones GET para obtener los tweets.

## Frontend
- **Visualización:** Para el frontend, he utilizado `Chart.js` y `Bootstrap` para crear una página tipo dashboard con gráficos y visualizaciones. Además, he aplicado una plantilla de estilos sencilla para mejorar la apariencia de la página.
