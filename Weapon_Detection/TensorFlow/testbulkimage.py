import cv2
import datetime
import os

for SOURCE_IMAGE_PATH in ['D:/merakiRetailAnalyticsPhaseTwo/Weapon_Detection/TensorFlow/Data/Image_5thIteration']:
    for img in os.listdir(SOURCE_IMAGE_PATH):
        current_image_path = str(SOURCE_IMAGE_PATH) + "/" + str(img)
        destination_image_path = str(SOURCE_IMAGE_PATH) + "/" + str('detected/')
        print (current_image_path)
        print (destination_image_path)
        os.system('python models/research/object_detection/Object_detection_image.py {} {} {}'.format(SOURCE_IMAGE_PATH,img,destination_image_path)) 