inverted='-1 0 1 0 -1 1 0 0 1'
deviceId=10
xinput set-prop $deviceId 'Coordinate Transformation Matrix' $inverted
xrandr -o inverted
xset -dpms
xset s off
chromium /
--window-size=1024,768 /
--kiosk /
--incognito /
--disable-infobars /
--noerrdialogs /
--disable-crash-report /
--start-fullscreen /
--start-maximized /
--window-position=0,0 /
--ignore-certificate-errors /
--test-type /
--disable-web-security /
http://application.local
