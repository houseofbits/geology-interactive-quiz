# Arch install
Guided script settings
 * Additional packages: nginx xterm chromium nano
 * Profile: xorg
 * Network: NetworkManager
 * User: lvdm
 * Hostname: lvdm

# Setup autologin 
Not needed if Running X11 as service

    sudo mkdir -p /etc/systemd/system/getty@tty1.service.d/
    
    sudo nano autologin.conf

    [Service]
    ExecStart=
    ExecStart=-/sbin/agetty --autologin lvdm --noclear %I $TERM
    
as an alternative, can run init.d script, similar to this (not tested):

    startx -e chromium http://application.local

# Update system
    sudo pacman -Syu

# Setup NGINX
If not installed by setup

    sudo pacman -S nginx

Enable

    sudo systemctl enable --now nginx

# X11 Configuration

    cp /etc/X11/xinit/xinitrc ~/.xinitrc

    sudo nano .xinitrc
        add
            exec chromium --kiosk --incognito --disable-web-security http://application.local
    
To test

    startx

# Disable sleep

    sudo nano ~/.xinitrc
        add
            xset -dpms
            xset s off

# Create X11 service
    
    sudo nano /etc/udev/rules.d/99-dri.rules
        add
            ACTION=="add", SUBSYSTEM=="drm", KERNEL=="card0", TAG+="systemd"

    sudo systemctl set-default graphical.target

    /etc/systemd/system/x11-autostart.service [copy from config]
    
    systemctl enable x11-autostart.service
    
For reference: https://vincent.bernat.ch/en/blog/2021-startx-systemd

# Configure webserver
    
    sudo mkdir -p /etc/nginx/sites-enabled
    sudo cp /mnt/usbdrive/install/config/default.nginx /etc/nginx/sites-enabled/
    sudo nano /etc/nginx/nginx.conf
        add in the http section
            include /etc/nginx/sites-enabled/*;

    sudo systemctl restart nginx

    sudo mkdir -p /var/www/html
    sudo cp -r /mnt/usbdrive/dist/* /var/www/html/

    sudo nano /etc/hosts
        add
            127.0.0.1   application.local

# Configure network (NetworkManager)
    
Install NetworkManager (if not installed by setup)

    sudo pacman -Syu
    sudo pacman -S networkmanager
    sudo systemctl disable systemd-networkd.service
    sudo systemctl enable NetworkManager.service
    sudo systemctl start NetworkManager.service

Create connections
    
    sudo nmcli con add type ethernet con-name internet1 ifname enp1s0
    sudo nmcli con add type ethernet con-name lvdm_static ifname enp1s0

    sudo nmcli con down 'Wired connection 1'
    sudo nmcli con up internet1

Set up static ip

    sudo nmcli con mod lvdm_static ipv4.addresses 10.10.30.212/24
    sudo nmcli con mod lvdm_static ipv4.method manual
    sudo nmcli con mod lvdm_static gw4 10.10.30.1
    sudo nmcli con mod lvdm_static ipv4.dns "212.70.167.11 212.70.167.12"

Disable other connections

    sudo nmcli connection delete 'Wired connection 1'
    sudo nmcli connection mod internet1 connection.autoconnect no

    ip a
    
For reference: 
 * https://www.tecmint.com/configure-network-connections-using-nmcli-tool-in-linux/        
 * https://www.linuxtechi.com/configure-ip-with-nmcli-command-linux/

# WOL

    sudo nmcli con mod lvdm_static 802-3-ethernet.wake-on-lan magic

    nmcli con show lvdm_static | grep wake-on-lan

# NTP

    timedatectl status
    timedatectl timesync-status

    sudo nano /etc/systemd/timesyncd.conf  
        add
            [Time]
            NTP=212.70.167.11 ...

    sudo systemctl restart systemd-timesyncd.service

    timedatectl show-timesync --all

# Power off

Create timed service

    /etc/systemd/system/timed-poweroff.timer [copy from config]
 
    sudo systemctl enable timed-poweroff.timer

Useful
    
    sudo systemctl start timed-poweroff.timer
    sudo systemctl list-timers --all
    sudo systemctl status timed-poweroff.timer

# To access network storage 
packages gvfs and gvfs-smb should be installed alongside nautilus 


    