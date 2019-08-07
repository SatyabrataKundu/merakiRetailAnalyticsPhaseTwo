import pandas as pd 
import numpy as np 
import matplotlib.pyplot as plt 
import statsmodels.api as sm
import math
import psycopg2
import datetime

#Importing data
df = pd.read_csv('./datasets/2018_hourly_data.csv')   #2018_hourly_data.csv #1year_hourly_data_2015.csv
# df.describe()

#Creating train and test set 
train=df[0:8784] #80% of data ( 0.8 * 8755 for training the model) 
test=df[8784:] # remaining 20% to test

#Aggregating the dataset at daily level
df.Timestamp = pd.to_datetime(df.dateformat_hour,format='%d-%m-%Y %H:%M') 
df.index = df.Timestamp 
df = df.resample('H').mean() #daily mean
train.Timestamp = pd.to_datetime(train.dateformat_hour,format='%d-%m-%Y %H:%M') 
train.index = train.Timestamp 
train = train.resample('H').mean() 
test.Timestamp = pd.to_datetime(test.dateformat_hour,format='%d-%m-%Y %H:%M') 
test.index = test.Timestamp 
test = test.resample('H').mean()

y_hat_avg = test.copy()
fit1 = sm.tsa.SARIMAX(train, order=(3, 1, 3),seasonal_order=(0,1,1,24)).fit()
y_hat_avg['SARIMA'] = predictions = fit1.predict(start="2019-05-01 00:00:00", end="2019-06-01 00:00:00", dynamic=True)

predictedValues = list()
for t in predictions:
    predictedValues.append(math.ceil(t))

print(predictedValues)




conn = psycopg2.connect("dbname=merakidb user=postgres password=postgres")
cur = conn.cursor()

x = datetime.datetime(2019,5,1)
count = 0

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





