#!/bin/bash
source common.sh
message "Setting up X11..."

message "Set up x11 service"
sudo touch /etc/udev/rules.d/99-dri.rules
sudo echo 'ACTION=="add", SUBSYSTEM=="drm", KERNEL=="card0", TAG+="systemd"' > /etc/udev/rules.d/99-dri.rules
sudo systemctl set-default graphical.target
sudo cp config/x11-autostart.service /etc/systemd/system/
sudo systemctl enable x11-autostart.service

message "Set up xinitrc"
cp config/kiosk.sh /home/lvdm/
touch /home/lvdm/.xinitrc
echo '/bin/bash /home/lvdm/kiosk.sh' > /home/lvdm/.xinitrc
