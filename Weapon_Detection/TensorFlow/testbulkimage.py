import cv2
import datetime
import os

for file_type in ['D:/merakiRetailAnalyticsPhaseTwo/Weapon_Detection/TensorFlow/Data/Image_3rdIteration']:
    for img in os.listdir(file_type):
        current_image_path = str(file_type) + "/" + str(img)
        print (current_image_path)
        os.system('python models/research/object_detection/Object_detection_image.py {}'.format(current_image_path)) 