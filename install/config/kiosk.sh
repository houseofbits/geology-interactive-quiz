inverted='-1 0 1 0 -1 1 0 0 1'
deviceId=$(xinput list | grep -m 1 'Atmel maXTouch' | grep -o 'id=[0-9]\+' | grep -o '[0-9]\+')

if [[ $deviceId ]]
then
  xinput set-prop $deviceId 'Coordinate Transformation Matrix' $inverted
  xrandr -o inverted
fi

xset -dpms
xset s off
chromium \
--window-size=1024,768 \
--kiosk \
--incognito \
--disable-infobars \
--noerrdialogs \
--disable-crash-report \
--start-fullscreen \
--start-maximized \
--window-position=0,0 \
--ignore-certificate-errors \
--test-type \
--disable-web-security \
http://application.local/quiz3
