# import os, sys
# import os.path, time
# path = 'D:/Pluralsight/13. Microsoft Azure/02. Introduction to Azure App Services'



# files = os.listdir(path)
# # files = glob.glob("*.mp4")
# files.sort(key=os.path.getmtime(path))
# i = 1

# print (files)
# for file in files:
#     os.rename(os.path.join(path, file), os.path.join(path, str(i)+'.mp4'))
#     i = i+1

from stat import S_ISREG, ST_CTIME, ST_MODE
import os, sys, time

#Relative or absolute path to the directory
dir_path = 'D:/Pluralsight/14. Angular/04. Angular Services'

#all entries in the directory w/ stats
data = (os.path.join(dir_path, fn) for fn in os.listdir(dir_path))
data = ((os.stat(path), path) for path in data)

# regular files, insert creation date
data = ((stat[ST_CTIME], path)
           for stat, path in data if S_ISREG(stat[ST_MODE]))
file_list = []
for cdate, path in sorted(data):
    file_list.append(os.path.basename(path))
print(file_list)    
i=1
for file in file_list:
    os.rename(os.path.join(dir_path, file), os.path.join(dir_path, str(i)+'.mp4'))
    i = i+1