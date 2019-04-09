#%%
import pandas as pd
import numpy as np
import math
import psycopg2
from pandas import datetime
import itertools
import matplotlib.pyplot as plt
from statsmodels.tsa.arima_model import ARIMA
import warnings

warnings.filterwarnings('ignore')

conn = psycopg2.connect("dbname=merakidb user=postgres password=postgres")
cur = conn.cursor()

cur.execute(
     'select dateformat_date, count(distinct(person_oid)) from meraki.visitor_predictions group by dateformat_date;')

rows = cur.fetchall()

valueList = []

for r in rows:
    value = []
    value.append(r[1])
    valueList.append(value)

valueList = np.array(valueList)

totalValues = len(valueList)
print(totalValues)

x = valueList
train = x[0:(math.ceil(totalValues*.8))]
test = x[(math.ceil(totalValues*.8)):]
predictions = []

p = d = q = range(0, 9)
pdq = list(itertools.product(p, d, q))

list1 = []
aicOrderDict = {}

for p in pdq:
    try:
        model_arima = ARIMA(train, order=p)
        model_arima_fit = model_arima.fit()
        list1.append(model_arima_fit.aic)
        aicOrderDict[model_arima_fit.aic] = p
        print('.')
    except:
        continue

list1.sort()
lowestAicValue = list1[0]
bestFitOrder = aicOrderDict[lowestAicValue]

model_arima = ARIMA(train, order=bestFitOrder)
model_arima_fit = model_arima.fit()

testList = []

predictions = model_arima_fit.forecast(steps=365)[0]
print(model_arima_fit.aic)

for t in test:
    testList.append(math.ceil(t[0]))

print(testList)
print(predictions.tolist())
print('Total Values ---> ', len(predictions))

plt.plot(test)
plt.plot(predictions)

do = 1

if (do == 1):
    cur.execute("DELETE FROM meraki.daily_visitor_predictions")
    for i in range(0, 365):
        dayCount = i+1
        visitorCount = math.ceil(predictions[i])
        cur.execute(
            "INSERT INTO meraki.daily_visitor_predictions (dateformat_day,count) VALUES (%s, %s);", (dayCount, visitorCount))
        conn.commit()

    # weekCountDictionary=[]

    # for i in range(0,52):
    #     countDictionary={}
    #     countDictionary["week"]=i+1
    #     countDictionary["count"]=math.ceil(predictions[i])
    #     weekCountDictionary.append(countDictionary)

    # return weekCountDictionary
