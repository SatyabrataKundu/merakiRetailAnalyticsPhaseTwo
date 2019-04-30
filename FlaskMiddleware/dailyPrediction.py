from pandas import *
import math
import matplotlib.pyplot as plt 
from statsmodels.tsa.arima_model import ARIMA
import numpy
import pandas as pd
import psycopg2

conn = psycopg2.connect("dbname=merakidb user=postgres password=postgres")
cur = conn.cursor()


# create a differenced series
def difference(dataset, interval=1):
	diff = list()
	for i in range(interval, len(dataset)):
		value = dataset[i] - dataset[i - interval]
		diff.append(value)
	return numpy.array(diff)

# invert differenced value
def inverse_difference(history, yhat, interval=1):
	return yhat + history[-interval]


# load dataset
series = Series.from_csv('./datasets/2015_data.csv', header=None)
# seasonal difference
X = series.values
#print(X)
days_in_year = 266
differenced = difference(X, days_in_year)
#print((differenced))
# fit model
model = ARIMA(differenced, order=(3,2,1))
model_fit = model.fit(disp=0)
# multi-step out-of-sample forecast
start_index = len(differenced)
end_index = start_index + 364
print(start_index)
print(end_index)

# start_index =  '25-09-2018'
# end_index =  '25-10-2018'
# print(start_index)
forecast = model_fit.predict(start=start_index, end=end_index)
# print(forecast)
# invert the differenced forecast to something usable
history = [x for x in X]
day = 1
predictions = list()
for yhat in forecast:
	inverted = inverse_difference(history, yhat, days_in_year)
	print('Day %d: %f' % (day, inverted))
	history.append(inverted)
	predictions.append(inverted)
	day += 1


cur.execute("DELETE FROM meraki.daily_visitor_predictions")
for i in range(0, 365):
    dayCount = i+1
    visitorCount = math.ceil(predictions[i])
    cur.execute("INSERT INTO meraki.daily_visitor_predictions (dateformat_day,count) VALUES (%s, %s);", (dayCount, visitorCount))
    conn.commit()