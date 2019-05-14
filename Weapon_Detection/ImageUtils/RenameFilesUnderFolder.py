import os
path = 'D:/merakiRetailAnalyticsPhaseTwo/Weapon_Detection/TensorFlow/Data/SnapShots'
# path = '../data/p'
# path = '../data/Random_Images'
files = os.listdir(path)
i = 1

for file in files:
    os.rename(os.path.join(path, file), os.path.join(path, str(i)+'.jpg'))
    i = i+1