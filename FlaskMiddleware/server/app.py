from flask import Flask, request, jsonify
import psycopg2
import os
import json

app = Flask(__name__)

con = psycopg2.connect("dbname=merakidb user=postgres password=postgres")

query = "select count(person_oid) from meraki.camera_detections where zoneid=2 group by dateformat_hour order by dateformat_hour"
query2 = "select visitor_count, datetime from meraki.scanning_visitorinfo;"
query3 = "select count(total_amount) from meraki.pos_data where dateformat_date ='27-03-2019';"

cur = con.cursor()
cur.execute(query)

rows = cur.fetchall()




@app.route('/', methods=['GET'])
def index():
    
    
    list1 = []

    for r in rows:
        data={}
        data['count']=str(r[0])
        data['count1']=str(r[0])
        list1.append(data)
    return jsonify (list1)


if __name__ == '__main__':
    app.run(debug=True)