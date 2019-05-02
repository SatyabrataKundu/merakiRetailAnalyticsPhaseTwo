"""
Creates a .csv file for train & test folders each. Created .csv file 
contains data extracted from all .xml files present in that folder. 

Note : You should be in 'object_detection' directory for this file to run correctly.

usage eg : parse_xml_to_csv.py images/

input  : None
output : Creates .csv file in '/images' folder,named as '<folder_name>_labels.csv'.
"""

import os
import glob
import pandas as pd
import xml.etree.ElementTree as ET


def xml_to_csv(path):

    xml_list=[]
    for xml_file in glob.glob(path + '/*.xml'):			# iterates through all .xml files
        tree = ET.parse(xml_file)						# Converts .xml file into tree structure
        root = tree.getroot()			
        for member in root.findall('object'):			# iterates through all '<object>' tags
            value = (root.find('filename').text,		# filename
                     int(root.find('size')[0].text),	# width
                     int(root.find('size')[1].text),	# height
                     member[0].text,					# class (eg. apple)
                     int(member[4][0].text),			# starting row pixel for bounding box
                     int(member[4][1].text),			# starting column pixel for bounding box
                     int(member[4][2].text),			# ending row pixel for bounding box
                     int(member[4][3].text)				# ending column pixel for bounding box
                     )
            xml_list.append(value)						# appends object's attribute tuple to list
    column_name = ['filename', 'width', 'height', 'class', 'xmin', 'ymin', 'xmax', 'ymax']
    xml_df = pd.DataFrame(xml_list, columns=column_name)# creates dataframe containing information of all images in path 
    return xml_df


def main():

	
    #for folder in ['train','test']:
    for folder in ['D:/Semicolon/Phase 2/merakiRetailAnalyticsPhaseTwo/Weapon_Detection/TensorFlow/Data/Neg']:
        image_path = os.path.join(os.getcwd(), ('' + folder))
        xml_df = xml_to_csv(image_path)
		
		#saving dataframe as *.csv in 'images/' folder.
        #xml_df.to_csv(('images/' + folder + '_labels.csv'), index=None)
        xml_df.to_csv(('D:/Semicolon/Phase 2/merakiRetailAnalyticsPhaseTwo/Weapon_Detection/TensorFlow/Data/csv/' + "Negative" + '_labels.csv'), index=None)
        print('Successfully converted xml to csv.')


main()
