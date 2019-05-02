'''
This script is to apply trained model to detect guns in a video clip
Author: Jizhou Yang
'''


import numpy as np
import cv2
import imutils
import datetime


camera = cv2.VideoCapture('../data/custom_video/12.mp4')

# initialize the first frame in the video stream
firstFrame = None

# loop over the frames of the video

gun_exist = False
count = 1
while True:
    (grabbed, frame) = camera.read()

    # if the frame could not be grabbed, then we have reached the end of the video
    if not grabbed:
        break

    # resize the frame, convert it to grayscale, and blur it
    frame = imutils.resize(frame, width=1920)
    current_image_path = "../data/FrameFromVideo" + "/" + str(count)+".jpg"
    
    count = count + 1  
    
    cv2.imwrite(current_image_path, frame)	


camera.release()
cv2.destroyAllWindows()



