import cv2
import os

def resize():

        for file_type in ['..\data\\n']:
            for img in os.listdir(file_type):
                current_image_path = str(file_type) + "/" + str(img)
                img1 = cv2.imread(current_image_path)
                resized_image = cv2.resize(img1, (160, 120))
                cv2.imwrite(current_image_path, resized_image)

        # current_image_path = "gun.jpg"
        # img1 = cv2.imread(current_image_path, cv2.IMREAD_GRAYSCALE)
        # resized_image = cv2.resize(img1, (50, 50))
        # cv2.imwrite(current_image_path, resized_image)

resize()