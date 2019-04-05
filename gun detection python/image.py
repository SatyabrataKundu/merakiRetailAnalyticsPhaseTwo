import cv2
import imutils
import datetime

# initialize the first frame in the video stream
firstFrame = None

# loop over the frames of the video

gun_exist = False

gun_cascade = cv2.CascadeClassifier('cascade.xml')
#frame = cv2.imread('data/download.jpg')  
frame = cv2.imread('data/Random_Images/10007.jpg')  
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
        #continue
cv2.imshow("Security Feed", frame)
#key = cv2.waitKey(1) & 0xFF
cv2.waitKey(0)    	
if gun_exist:
    print("guns detected")
else:
    print("guns NOT detected")

# cleanup the camera and close any open windows
#camera.release()
cv2.destroyAllWindows()