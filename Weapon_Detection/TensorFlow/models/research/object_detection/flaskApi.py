#!flask/bin/python
from flask import Flask
import os
import cv2
import numpy as np
import tensorflow as tf
from flask import jsonify
from flask_socketio import SocketIO
import atexit
from apscheduler.scheduler import Scheduler
import requests
import shutil
import base64
import calendar;
import time;

import sys

app = Flask(__name__)
socketio = SocketIO(app)

# defining the api-endpoint
API_ENDPOINT = "http://localhost:4004/api/v0/meraki/checkout/getimage"

cron = Scheduler(daemon=True)
# Explicitly kick off the background thread
cron.start()


@cron.interval_schedule(minutes=1)
def job():
    print("I'm working...")
    ts = calendar.timegm(time.gmtime())
    IMAGE_NAME = "image-snapshot-" + str(ts) + ".jpg"
    path="D:/MERAKI-RETAIL-ANALYTICS-PHASE2/merakiRetailAnalyticsPhaseTwo/Weapon_Detection/TensorFlow/models/research/object_detection/downloaded/"+IMAGE_NAME
    r = requests.get(url=API_ENDPOINT,stream=True)
    if r.status_code == 200:
        with open(path, 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)
            index(IMAGE_NAME)


def index(IMAGE_NAME):
    print('IN PYTHON FILE')
    os.chdir("D:/MERAKI-RETAIL-ANALYTICS-PHASE2/merakiRetailAnalyticsPhaseTwo/Weapon_Detection/TensorFlow/models/research/object_detection/")
    # Import utilitescls
    from utils import label_map_util
    from utils import visualization_utils as vis_util
    # Name of the directory containing the object detection module we're using
    MODEL_NAME = 'inference_graph'
    # Source of the image directory and name of the snapshot images
    SOURCE_IMAGE_PATH = "D:/MERAKI-RETAIL-ANALYTICS-PHASE2/merakiRetailAnalyticsPhaseTwo/Weapon_Detection/TensorFlow/models/research/object_detection/downloaded/"
    ts = calendar.timegm(time.gmtime())
    # IMAGE_NAME = "image-snapshot-"+str(ts)+".jpg"
    CURRENT_IMAGE_PATH = str(SOURCE_IMAGE_PATH) + "/" + str(IMAGE_NAME)
    print('Name of the Image: ',CURRENT_IMAGE_PATH)
    DESTINATION_IMAGE_PATH = "D:/MERAKI-RETAIL-ANALYTICS-PHASE2/merakiRetailAnalyticsPhaseTwo/Weapon_Detection/TensorFlow/models/research/object_detection/detected/";
    CWD_PATH = os.getcwd()
    # Path to frozen detection graph .pb file, which contains the model that is used
    # for object detection.
    PATH_TO_CKPT = os.path.join(CWD_PATH, MODEL_NAME, 'frozen_inference_graph.pb')
    print('path to inference graph pb  ',PATH_TO_CKPT)
    # Path to label map file
    PATH_TO_LABELS = os.path.join(CWD_PATH, 'inference_graph', 'labelmap.pbtxt')
    print('path to labels file ',PATH_TO_LABELS)
    # Path to image
    PATH_TO_IMAGE = os.path.join(CWD_PATH, CURRENT_IMAGE_PATH)
    print('PATH TO IMAGE IS ', PATH_TO_IMAGE)
    NUM_CLASSES = 6
    label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
    print('label_map value ',label_map)
    categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=NUM_CLASSES,use_display_name=True)
    print('categories..',categories)
    category_index = label_map_util.create_category_index(categories)
    print('category_index ...',category_index)

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
    print('image_tensor:',image_tensor)
    # Output tensors are the detection boxes, scores, and classes
    # Each box represents a part of the image where a particular object was detected
    detection_boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
    print('detection_boxes:',detection_boxes)

    # Each score represents level of confidence for each of the objects.
    # The score is shown on the result image, together with the class label.
    detection_scores = detection_graph.get_tensor_by_name('detection_scores:0')
    detection_classes = detection_graph.get_tensor_by_name('detection_classes:0')
    print('detection_classes',detection_classes)

    # Number of objects detected
    num_detections = detection_graph.get_tensor_by_name('num_detections:0')

    # Load image using OpenCV and
    # expand image dimensions to have shape: [1, None, None, 3]
    # i.e. a single-column array, where each item in the column has the pixel RGB value
    image = cv2.imread(PATH_TO_IMAGE)
    print('image....')
    image_expanded = np.expand_dims(image, axis=0)
    print('image_expanded')

    # Perform the actual detection by running the model with the image as input
    (boxes, scores, classes, num) = sess.run(
        [detection_boxes, detection_scores, detection_classes, num_detections],
        feed_dict={image_tensor: image_expanded})
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
    # print('scores :',scores)
    # print('category_index: ',category_index)
    isGunDetected = False
    encoded_string = ''
    for i in range(100):
        if scores is None or final_score[i] > 0.95:
            isGunDetected = True
            imageFileName = str(IMAGE_NAME).replace(".jpg","")+ str(ts)+".jpg"
            if (isGunDetected):
                # ts = calendar.timegm(time.gmtime())
                print('Gun is detected')
                cv2.imwrite(DESTINATION_IMAGE_PATH+IMAGE_NAME , image)
                time.sleep(2)
                with open(DESTINATION_IMAGE_PATH+IMAGE_NAME, "rb") as image_file:
                    encoded_string = base64.b64encode(image_file.read())
                    print('GUN DETECTED : ', isGunDetected)
                    x = '{ "detected": '+str(encoded_string)+'}'
                    # All the results have been drawn on image. Now display the image.
                    socketio.emit('new-message', x)


# Shutdown your cron thread if the web process is stopped
atexit.register(lambda: cron.shutdown(wait=False))


if __name__ == '__main__':
    app.run(debug=True, port=5002)