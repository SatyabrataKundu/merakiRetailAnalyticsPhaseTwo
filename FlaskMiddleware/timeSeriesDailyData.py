#!/usr/bin/env python
# coding: utf-8

# In[ ]:


import pandas as pd
import math
from pandas import datetime
import matplotlib.pyplot as plt

def parser(x):
    return datetime.strptime(x,'%Y-%m-%d')

visitors = pd.read_csv('data-1554282555093.csv',index_col=0, parse_dates=[0], date_parser=parser)

visitors.plot()


# In[ ]:


from statsmodels.graphics.tsaplots import plot_acf
visitorsDiff = visitors.diff(periods=3)
visitorsDiff = visitorsDiff[3:]
visitorsDiff.head()
# visitorsDiff.plot(color='green')


# In[ ]:


x = visitors.values
train = x[0:20]
test = x[20:]
predictions = []


# In[ ]:


##  ARIMA MODEL


# In[ ]:


from statsmodels.tsa.arima_model import ARIMA

model_arima = ARIMA(train, order=(2,0,1))
model_arima_fit = model_arima.fit()


predictions = model_arima_fit.forecast(steps=3)[0]
print (model_arima_fit.aic)
print (predictions.tolist())
print ('Total Values ---> ',len(predictions))

plt.plot(test)
plt.plot(predictions)


# In[ ]:


import itertools
p=d=q=range(0,10)
pdq = list(itertools.product(p,d,q))
pdq

