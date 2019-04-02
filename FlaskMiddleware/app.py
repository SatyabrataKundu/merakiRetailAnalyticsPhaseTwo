from flask import Flask, request, jsonify
from flask_cors import CORS
from models import predictedValues
import psycopg2
import os
import json

app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    
    fetchedList = predictedValues()
    list=[]
    for r in fetchedList:
        data={}
        data['count']=r
        list.append(data)
    return jsonify (list)


if __name__ == '__main__':
    app.run(debug=True)