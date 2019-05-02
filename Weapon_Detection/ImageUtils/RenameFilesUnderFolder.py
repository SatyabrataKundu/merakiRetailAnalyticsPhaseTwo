import os
path = '..\data\FrameFromVideo'
# path = '..\data\p'
# path = '..\data\Random_Images'
files = os.listdir(path)
i = 100000

for file in files:
    os.rename(os.path.join(path, file), os.path.join(path, str(i)+'.jpg'))
    i = i+1