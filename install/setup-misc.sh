#!/bin/bash
source common.sh
message "Set up random stuff..."

message "Scheduled poweroff service"
sudo cp config/timed-poweroff.timer /etc/systemd/system/
sudo systemctl enable timed-poweroff.timer

message "Set timezone to Europe/Riga"
sudo timedatectl set-timezone Europe/Riga