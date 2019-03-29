import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import psycopg2
import csv
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
# get_ipython().run_line_magic('matplotlib', 'inline')


con = psycopg2.connect("dbname=merakidb user=postgres password=postgres")

query = "select dateformat_hour as timeRange, count(person_oid) as detected_clients from meraki.camera_detections where zoneid=2 group by dateformat_hour order by dateformat_hour"
query2 = "select datetime, visitor_count from meraki.scanning_visitorinfo;"

cur = con.cursor()
cur.execute(query)

rows = cur.fetchall()

# c = csv.writer(open('E:\FlaskApp\dbdump10.csv', 'w'))
# c.writerow(["Hour", "Count"])

# for r in rows:
#     c.writerow(r)

data = pd.read_csv(r'E:\FlaskApp\dbdump10.csv')
X = data.iloc[:,:-1].values
Y = data.iloc[:,1].values
# print(X)
# print(Y)
# data.head()

from sklearn.model_selection import train_test_split
x_train, x_test, y_train, y_test = train_test_split(X, Y, test_size=0.2, random_state=0)

from sklearn.linear_model import LinearRegression
regressor = LinearRegression()
regressor.fit(x_train,y_train)

y_pred = regressor.predict(x_test)

from sklearn.metrics import r2_score

coeff = regressor.coef_
intercept = regressor.intercept_

predictedValues = []

print("R2 SCORE ----------->",r2_score(y_test,y_pred))
print("CO-EFFICIENT ------->",regressor.coef_)
print("INTERCEPT ---------->",regressor.intercept_)
print("PREDICTION VALUES -->",np.ceil(y_pred))
print("Y_TEST------------->",y_test)

for x in range(0, 24):
    y = ( coeff * x ) + intercept
    predictedValues.append(y)
    
# print (predictedValues.length())
print (predictedValues)

for y in predictedValues:
    print (y)