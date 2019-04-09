from timeSeriesWeeklyData import weeklyPredcitions
import psycopg2
import os
import json
import schedule
import time

def weeklyPredcitionsStore():
    seconds = time.time()
    local_time = time.ctime(seconds)
    print('weekly prediction started at : ',local_time)
    weeklyPredcitions()

schedule.every().tuesday.at("11:01").do(weeklyPredcitionsStore)

while True:
    schedule.run_pending()
    time.sleep(1)