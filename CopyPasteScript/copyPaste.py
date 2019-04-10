import os
import shutil

src_dir="****" #replace ***** with source directory with file and file extension

for i in range(0,50): 
    dst_dir="****"+str(i)+".file-extension" #replace ***** with destination directory and replace file-extension with file extension (.jpg, .txt, etc)
    shutil.copy(src_dir,dst_dir)