import cv2
import imutils
import datetime
import os

# initialize the first frame in the video stream
firstFrame = None

# loop over the frames of the video

gun_exist = False

gun_cascade = cv2.CascadeClassifier('cascade.xml')
for file_type in ['data/Random_Images']:
# for file_type in ['data/p']:
# for file_type in ['data/Random_Images']:
    for img in os.listdir(file_type):
        gun_exist = False
        current_image_path = str(file_type) + "/" + str(img)
        frame = cv2.imread(current_image_path)  
        frame = imutils.resize(frame, width=500)
        # gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        gray = cv2.GaussianBlur(frame, (21, 21), 0)
        gun = gun_cascade.detectMultiScale(gray, 1.3, 5, minSize = (24, 24))
        if len(gun) > 0:
            gun_exist = True
        for (x,y,w,h) in gun:
            frame = cv2.rectangle(frame,(x,y),(x+w,y+h),(255,0,0),2)
            roi_gray = gray[y:y+h, x:x+w]
            roi_color = frame[y:y+h, x:x+w]    
        if firstFrame is None:
            firstFrame = gray  	
        if gun_exist:
            print(current_image_path +",guns detected")
            cv2.imwrite("data/detected/"+ str(img),frame)
            count=1
        else:
            print(current_image_path +",guns NOT detected")

# cleanup the camera and close any open windows
#camera.release()
cv2.destroyAllWindows()