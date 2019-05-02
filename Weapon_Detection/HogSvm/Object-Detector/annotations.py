import numpy as np
import cv2
from PIL import Image
import argparse
from imutils.paths import list_images
import xml.etree.ElementTree as ET
from selectors import BoxSelector

#parse arguments
ap = argparse.ArgumentParser()
ap.add_argument("-d","--dataset",required=True,help="path to images dataset...")
ap.add_argument("-a","--annotations",required=True,help="path to save annotations...")
ap.add_argument("-i","--images",required=True,help="path to save images")
args = vars(ap.parse_args())

#annotations and image paths
annotations = []
imPaths = []

#loop through each image and collect annotations
for imagePath in list_images(args["dataset"]):
    img = Image.open(imagePath)
    xb,yb = img.size
    print(xb,yb, imagePath)
    annotations.append([0,0,int(xb),int(yb)])
    # if "1190.jpg" in imagePath:
    #     rect = cv2.imread(imagePath)
    #     rect = cv2.rectangle(rect,(0,0),(xb,yb),(0,244,0),5)
    #     cv2.imshow('img',rect)
    #     cv2.waitKey(0)
    imPaths.append(imagePath)
    # print(imagePath)
#save annotations and image paths to disk
annotations = np.array(annotations)
imPaths = np.array(imPaths,dtype="unicode")
np.save(args["annotations"],annotations)
np.save(args["images"],imPaths)
