from sklearn.metrics import r2_score
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import psycopg2
import csv
import os
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
# get_ipython().run_line_magic('matplotlib', 'inline')



def predictedValues():
    con = psycopg2.connect("dbname=merakidb user=postgres password=postgres")
    query = "select dateformat_hour as timeRange, count(person_oid) as detected_clients from meraki.camera_detections group by dateformat_hour order by dateformat_hour"
    # query2 = "select datetime, visitor_count from meraki.scanning_visitorinfo;"
    cur = con.cursor()
    cur.execute(query)
    rows = cur.fetchall()

    exists = os.path.isfile('E:/merakiRetailAnalyticsPhaseTwo/FlaskMiddleware/datasets/dbdump1.csv')

    # if exists:
    #     os.remove("E:/merakiRetailAnalyticsPhaseTwo/FlaskMiddleware/datasets/dbdump.csv")

    f = open('E:/merakiRetailAnalyticsPhaseTwo/FlaskMiddleware/datasets/dbdump1.csv', 'w')
    c = csv.writer(f)
    c.writerow(["Hour", "Count"])

    for r in rows:
        c.writerow(r)

    f.close()


    data = pd.read_csv(r'E:/merakiRetailAnalyticsPhaseTwo/FlaskMiddleware/datasets/dbdump1.csv')
    X = data.iloc[:, :-1].values
    Y = data.iloc[:, 1].values
    # print(X)
    # print(Y)
    # data.head()
    x_train, x_test, y_train, y_test = train_test_split(
        X, Y, test_size=0.6, random_state=0)
    regressor = LinearRegression()
    regressor.fit(x_train, y_train)

    y_pred = regressor.predict(x_test)
    coeff = regressor.coef_
    intercept = regressor.intercept_

    predictedValues = []
    print("R2 SCORE ----------->", r2_score(y_test, y_pred))
    print("CO-EFFICIENT ------->", regressor.coef_)
    print("INTERCEPT ---------->", regressor.intercept_)
    print("PREDICTION VALUES -->", np.ceil(y_pred))
    print("Y_TEST------------->", y_test)

    for x in range(7, 22):
        y = (coeff * x) + intercept
        predictedValues.append(y)

    predictedValuesResponseArray = []

    for t in predictedValues:
        predictedValuesResponseArray.append(int("%.0f" %t[0]))
    
    print (predictedValuesResponseArray)

    return predictedValuesResponseArray
