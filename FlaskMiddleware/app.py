from timeSeriesWeeklyData import weeklyPredcitions
from timeSeriesDailyData import dailyPredictions
import os
import json
import schedule
import time

def PredcitionsStore():
    seconds = time.time()
    local_time = time.ctime(seconds)
    print('weekly prediction started at : ',local_time)
    weeklyPredcitions()
    dailyPredictions()

schedule.every().wednesday.at("14:18").do(PredcitionsStore)

while True:
    schedule.run_pending()
    time.sleep(1)