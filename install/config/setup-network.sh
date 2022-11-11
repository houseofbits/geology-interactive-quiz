#!/bin/bash
source common.sh
message "Setting up NetworkManager..."

message "Create connections"
sudo nmcli con add type ethernet con-name internet1 ifname enp1s0
sudo nmcli con add type ethernet con-name lvdm_static ifname enp1s0

message "internet1 up"
sudo nmcli con up internet1

message "Configure lvdm_static"
sudo nmcli con mod lvdm_static ipv4.addresses 10.10.30.212/24
sudo nmcli con mod lvdm_static ipv4.method manual
sudo nmcli con mod lvdm_static gw4 10.10.30.1
sudo nmcli con mod lvdm_static ipv4.dns "212.70.167.11 212.70.167.12"

message "Enable WOL for lvdm_static"
sudo nmcli con mod lvdm_static 802-3-ethernet.wake-on-lan magic

message "Set autoconnect"
sudo nmcli connection delete 'Wired connection 1'
sudo nmcli connection mod internet1 connection.autoconnect no