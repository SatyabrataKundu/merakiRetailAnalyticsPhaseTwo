from timeSeriesWeeklyData import weeklyPredcitions
from timeSeriesDailyData import dailyPredictions
from timeSeriesHourlyData import hourlyPredictions
import os
import json
import schedule
import time

def PredcitionsStore():
    seconds = time.time()
    local_time = time.ctime(seconds)
    print('prediction started at : ',local_time)
    weeklyPredcitions()
    dailyPredictions()
    hourlyPredictions()

schedule.every().wednesday.at("17:30").do(PredcitionsStore)

while True:
    schedule.run_pending()
    time.sleep(1)