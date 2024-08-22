import os
import asyncio
from twscrape import API, gather
from pymongo import MongoClient
from dotenv import load_dotenv
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Cargar las variables de entorno
load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI')

# Conexión a MongoDB
client = MongoClient(MONGODB_URI)
db = client['farina_db']
tweets_collection = db['tweets']

# Inicializar el analizador VADER
analyzer = SentimentIntensityAnalyzer()

async def main():
    # Crear instancia de la API
    api = API()

    # Agregar cuentas de Twitter (debes reemplazar estos datos con cuentas válidas)
    await api.pool.add_account("testpython6668", "testpython123", "testpython6668", "tespython123")
    await api.pool.login_all()

    # Buscar tweets con el hashtag #farina
    tweets = await gather(api.search("#farina", limit=100))

    # Guardar los tweets en MongoDB con análisis de sentimientos
    for tweet in tweets:
        tweet_text = tweet.rawContent
        sentiment_score = analyzer.polarity_scores(tweet_text)

        tweet_data = {
            'id': tweet.id,
            'text': tweet_text,
            'created_at': tweet.date,
            'user': tweet.user.username,
            'lang': tweet.lang,
            'sentiment_score': sentiment_score['compound'],
            'sentiment': 'positive' if sentiment_score['compound'] >= 0.05 else 'negative' if sentiment_score['compound'] <= -0.05 else 'neutral'
        }
        tweets_collection.insert_one(tweet_data)

    print("Tweets extraídos y almacenados en MongoDB.")

if __name__ == "__main__":
    asyncio.run(main())
