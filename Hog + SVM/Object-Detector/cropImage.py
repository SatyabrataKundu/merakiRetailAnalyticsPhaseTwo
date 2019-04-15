from PIL import Image
import os
import xml.etree.ElementTree as ET


for file_type in ['Images']:
    for img1 in os.listdir(file_type):
        if "jpg" in img1:
            xml_file = file_type +"/"+img1.replace("jpg","xml")
            tree = ET.parse(xml_file)  # Converts .xml file into tree structure
            root = tree.getroot()

            for member in root.findall('object'):  # iterates through all '<object>' tags
                x = member[4][0].text
                y = member[4][1].text
                xb = member[4][2].text
                yb = member[4][3].text
            print("X = {} Y = {}, XB = {}, YB = {}".format(x,y,xb,yb))
            # print(file_type)
            img = Image.open(file_type + '/' + img1)
            img = img.crop((int(x),int(y),int(xb),int(yb)))
            img = img.resize((120,150))
            img.save("cropped/"+ img1)