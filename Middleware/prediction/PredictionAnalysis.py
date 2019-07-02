import pandas as pd 
import numpy as np 
import matplotlib.pyplot as plt 
import statsmodels.api as sm
import math
import psycopg2
import datetime

today = datetime.date.today()
day = today.strftime('%d')
#startMonth = today.strftime('%m')
startMonth = '0' + str(int(today.strftime('%m')) - 1)
endMonth = '0' + str(int(startMonth) + 2)
year = today.year

startDate = str(year)+'-'+str(startMonth)+'-'+'01'+' '+'00:00:00'
endDate = str(year)+'-'+str(endMonth)+'-'+'01'+' '+'00:00:00'

#Importing data
df = pd.read_csv('2018_hourly_data_10X_1.csv')   #2018_hourly_data.csv #1year_hourly_data_2015.csv
# df.describe()

#Creating train and test set 
train=df[0:8784] #80% of data ( 0.8 * 8755 for training the model) 
test=df[8784:] # remaining 20% to test

#Aggregating the dataset at daily level
df.Timestamp = pd.to_datetime(df.dateformat_hour,format='%Y-%m-%d %H:%M:%S') 
df.index = df.Timestamp 
df = df.resample('H').mean() #daily mean
train.Timestamp = pd.to_datetime(train.dateformat_hour,format='%Y-%m-%d %H:%M:%S') 
train.index = train.Timestamp 
train = train.resample('H').mean() 
test.Timestamp = pd.to_datetime(test.dateformat_hour,format='%Y-%m-%d %H:%M:%S') 
test.index = test.Timestamp 
test = test.resample('H').mean()

y_hat_avg = test.copy()
fit1 = sm.tsa.SARIMAX(train, order=(3, 1, 3),seasonal_order=(0,1,1,24)).fit()
y_hat_avg['SARIMA'] = predictions = fit1.predict(start=startDate, end=endDate, dynamic=True)

predictedValues = list()
for t in predictions:
    predictedValues.append(math.ceil(t))

print(predictedValues)




conn = psycopg2.connect("dbname=merakidb user=postgres password=postgres")
cur = conn.cursor()

yearParam = today.year
monthparam = today.month -1

x = datetime.datetime(yearParam,monthparam,1)
count = 0

cur.execute("DELETE FROM meraki.prediction_value_table")
for i in range(len(predictions)):
    
    if(count == 24):
        x += datetime.timedelta(days=1)
        count=0
    else:
        time = x.strftime("%x")
        visitorCount = predictedValues[i]
        cur.execute("INSERT INTO meraki.prediction_value_table (dateformat_date,count) VALUES (%s, %s);", (time, visitorCount))
        conn.commit()
        print(time,visitorCount)
    
    count += 1
