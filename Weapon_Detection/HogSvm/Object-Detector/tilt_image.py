import cv2,os
import numpy as np
from scipy import ndimage

def rotateImage(image, angle,count):
  # image_center = tuple(np.array(image.shape[1::-1]) / 2)
  # rot_mat = cv2.getRotationMatrix2D(image_center, angle, 1.0)
  # result = cv2.warpAffine(image, rot_mat, image.shape[1::-1], flags=cv2.INTER_LINEAR)
  rotated = ndimage.rotate(image, angle, cval=255)
  rotated = cv2.resize(rotated, (360, 480))
  cv2.imwrite("Images/"+str(count)+".jpg", rotated)
  # return result

def start():
    count = 100000
    for file_type in ['Samples']:
      for img in os.listdir(file_type):
                current_image_path = str(file_type) + "/" + str(img)
                img1 = cv2.imread(current_image_path)
                for i in range (0,360,5):
                  rotateImage(img1,i,count)
                  count +=1
start()