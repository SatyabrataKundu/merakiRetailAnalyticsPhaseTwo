import schedule
import time

def job():
    print('hello')

def jobtest():
    print('day of week')

schedule.every().monday.at("15:30").do(job)

while True:
    schedule.run_pending()
    time.sleep(1)