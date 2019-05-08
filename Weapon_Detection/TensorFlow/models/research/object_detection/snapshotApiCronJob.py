import os
import json
import schedule
import time
import requests
import shutil


# defining the api-endpoint
API_ENDPOINT = "http://localhost:4004/api/v0/meraki/checkout/getimage"

def job():
    print("I'm working...")
    path="D:/MERAKI-RETAIL-ANALYTICS-PHASE2/merakiRetailAnalyticsPhaseTwo/Weapon_Detection/TensorFlow/models/research/object_detection/image-snapshot.jpg"
    r = requests.get(url=API_ENDPOINT,stream=True)
    if r.status_code == 200:
        with open(path, 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)

schedule.every(1).minutes.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)