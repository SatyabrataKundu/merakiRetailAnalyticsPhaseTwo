######## Image Object Detection Using Tensorflow-trained Classifier #########
#
# Author: satyabrata Kundu
# Date: 2/5/19
# Description: 
# This program uses a TensorFlow-trained classifier to perform object detection.
# It loads the classifier uses it to perform object detection on an image.
# It draws boxes and scores around the objects of interest in the image.

## Some of the code is copied from Google's example at
## https://github.com/tensorflow/models/blob/master/research/object_detection/object_detection_tutorial.ipynb

## and some is copied from Dat Tran's example at
## https://github.com/datitran/object_detector_app/blob/master/object_detection_app.py

## but I changed it to make it more understandable to me.

# Import packages
import os
import cv2
import numpy as np
import tensorflow as tf
import sys
print('IN PYTHON FILE')
# This is needed since the notebook is stored in the object_detection folder.
sys.path.append("..")
os.chdir("D:/merakiRetailAnalyticsPhaseTwo/Weapon_Detection/TensorFlow/models/research/object_detection/")

# Import utilitescls

from utils import label_map_util
from utils import visualization_utils as vis_util

# Name of the directory containing the object detection module we're using
MODEL_NAME = 'inference_graph'
# Source of the image directory and name of the snapshot images
SOURCE_IMAGE_PATH = sys.argv[1]
IMAGE_NAME = sys.argv[2]
CURRENT_IMAGE_PATH = str(SOURCE_IMAGE_PATH) + "/" + str(IMAGE_NAME)
print('Name of the Image: ',CURRENT_IMAGE_PATH)
# Distination of the image directory
if len(sys.argv) > 3 :
    DESTINATION_IMAGE_PATH = sys.argv[3]
    print('Name of the Image: ',DESTINATION_IMAGE_PATH)
# Grab path to current working directory
CWD_PATH = os.getcwd()

# Path to frozen detection graph .pb file, which contains the model that is used
# for object detection.
PATH_TO_CKPT = os.path.join(CWD_PATH,MODEL_NAME,'frozen_inference_graph.pb')
#print('path to inference graph pb  ',PATH_TO_CKPT)

# Path to label map file
PATH_TO_LABELS = os.path.join(CWD_PATH,'inference_graph','labelmap.pbtxt')

# Path to image
PATH_TO_IMAGE = os.path.join(CWD_PATH,CURRENT_IMAGE_PATH)

# Number of classes the object detector can identify
NUM_CLASSES = 6

# Load the label map.
# Label maps map indices to category names, so that when our convolution
# network predicts `5`, we know that this corresponds to `king`.
# Here we use internal utility functions, but anything that returns a
# dictionary mapping integers to appropriate string labels would be fine
label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=NUM_CLASSES, use_display_name=True)
category_index = label_map_util.create_category_index(categories)

# Load the Tensorflow model into memory.
detection_graph = tf.Graph()
with detection_graph.as_default():
    od_graph_def = tf.GraphDef()
    with tf.gfile.GFile(PATH_TO_CKPT, 'rb') as fid:
        serialized_graph = fid.read()
        od_graph_def.ParseFromString(serialized_graph)
        tf.import_graph_def(od_graph_def, name='')

    sess = tf.Session(graph=detection_graph)

# Define input and output tensors (i.e. data) for the object detection classifier

# Input tensor is the image
image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')

# Output tensors are the detection boxes, scores, and classes
# Each box represents a part of the image where a particular object was detected
detection_boxes = detection_graph.get_tensor_by_name('detection_boxes:0')

# Each score represents level of confidence for each of the objects.
# The score is shown on the result image, together with the class label.
detection_scores = detection_graph.get_tensor_by_name('detection_scores:0')
detection_classes = detection_graph.get_tensor_by_name('detection_classes:0')

# Number of objects detected
num_detections = detection_graph.get_tensor_by_name('num_detections:0')

# Load image using OpenCV and
# expand image dimensions to have shape: [1, None, None, 3]
# i.e. a single-column array, where each item in the column has the pixel RGB value
image = cv2.imread(PATH_TO_IMAGE)
image_expanded = np.expand_dims(image, axis=0)

# Perform the actual detection by running the model with the image as input
(boxes, scores, classes, num) = sess.run(
    [detection_boxes, detection_scores, detection_classes, num_detections],
    feed_dict={image_tensor: image_expanded})

# Draw the results of the detection (aka 'visulaize the results')

vis_util.visualize_boxes_and_labels_on_image_array(
    image,
    np.squeeze(boxes),
    np.squeeze(classes).astype(np.int32),
    np.squeeze(scores),
    category_index,
    use_normalized_coordinates=True,
    line_thickness=8,
    min_score_thresh=0.95)
final_score = np.squeeze(scores)
#print('scores :',scores)
#print('category_index: ',category_index)
isGunDetected=False
for i in range(100):
 if scores is None or final_score[i] > 0.95:
  isGunDetected=True
print('GUN DETECTED : ',isGunDetected)

# All the results have been drawn on image. Now display the image.
if len(sys.argv) > 3  :
    if(isGunDetected) :
        cv2.imwrite( DESTINATION_IMAGE_PATH + str(IMAGE_NAME),image)
# Clean up
cv2.destroyAllWindows()
