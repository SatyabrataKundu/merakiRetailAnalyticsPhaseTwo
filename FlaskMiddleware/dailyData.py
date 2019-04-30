import pandas as pd
from pandas import read_csv
from pandas import datetime
from matplotlib import pyplot
from statsmodels.tsa.arima_model import ARIMA
from sklearn.metrics import mean_squared_error
import psycopg2
import math
import warnings

warnings.filterwarnings('ignore')

conn = psycopg2.connect("dbname=merakidb user=postgres password=postgres")
cur = conn.cursor()

dateparse = lambda dates: datetime.strptime(dates, '%Y-%m-%d')
series = read_csv('./datasets/4yearVisitorData.csv', parse_dates=['dateformat_date'], index_col='dateformat_date',date_parser=dateparse)
pyplot.plot(series)
X = series.values
size = int(len(X) * 0.66)
train, test = X[0:size], X[size:len(X)]
history = [x for x in train]
predictions = list()

start_index = datetime(2019, 1, 1)
end_index = datetime(2019, 2, 1)

for t in range(len(test)):
	model = ARIMA(history, order=(6,1,0))
	model_fit = model.fit(disp=0)
	output = model_fit.predict(start=start_index, end=end_index)
	yhat = output[0]
	predictions.append(yhat)
	obs = test[t]
	history.append(obs)
	print('..')
	#print('predicted=%.0f, expected=%.0f' % (yhat, obs))
error = mean_squared_error(test, predictions)
print('Test MSE: %.3f' % error)
# plot
# pyplot.plot(test[0:10])
# pyplot.plot(predictions[0:10], color='orange')
# print(len(predictions))
# pyplot.show()

predictionValues = list()
for p in predictions:
    predictionValues.append(math.ceil(p[0]))

print(predictionValues)

do=1

if (do == 1):
        cur.execute("DELETE FROM meraki.daily_visitor_predictions")
        for i in range(len(predictionValues)):
            dayCount = i+1
            visitorCount = math.ceil(predictionValues[i])
            cur.execute(
                "INSERT INTO meraki.daily_visitor_predictions (dateformat_day,count) VALUES (%s, %s);", (dayCount, visitorCount))
            conn.commit()