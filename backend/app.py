from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Cargar las variables de entorno
load_dotenv()

app = Flask(__name__)
CORS(app)  # Habilitar CORS para permitir solicitudes desde el frontend

# Conexión a MongoDB
MONGODB_URI = os.getenv('MONGODB_URI')
client = MongoClient(MONGODB_URI)
db = client['farina_db']
tweets_collection = db['tweets']

@app.route('/tweets', methods=['GET'])
def get_tweets():
    tweets = list(tweets_collection.find())
    for tweet in tweets:
        tweet['_id'] = str(tweet['_id'])  # Convertir ObjectId a string para que sea serializable
    return jsonify(tweets)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

