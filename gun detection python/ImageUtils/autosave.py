import pyautogui
pyautogui.PAUSE=0.00001

print (pyautogui.position())

for i in range(1,1854):
    pyautogui.click(27,381)
    pyautogui.click(47,257)