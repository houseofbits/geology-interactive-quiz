Ubuntu 20.04

Common information: 
    Location to web application: /var/www/application/geology-interactive-quiz
    To pull latest version use: git pull
    Local host name: application.local   
    Auto-login user:
        user: application
        password: app1
    Autostart script: /var/www/application/kiosk-startup-script.sh


1) sudo apt-get update

2) Install SSH server

    sudo apt install openssh-server

    sudo systemctl status ssh

    sudo ufw allow ssh

3) Install Google Chrome

    wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

    sudo apt install ./google-chrome-stable_current_amd64.deb

4) Install chrome guestures disabling plugin

    sudo apt-get install chrome-gnome-shell

    Open in Chrome: https://extensions.gnome.org/extension/1140/disable-gestures/

5) Install GIT

    sudo apt install git

6) Install NGINX

    sudo apt install nginx

    sudo ufw allow 'Nginx HTTP'

    systemctl status nginx

7) Configure webserver

    sudo mkdir -p /var/www/application

    cd /var/www/application/

    sudo git clone https://github.com/houseofbits/geology-interactive-quiz

    sudo nano /etc/hosts
        Add: 0.0.0.0 application.local

    sudo nano /etc/nginx/sites-available/application
        Add:
----------------
server {
        listen 80;
        listen [::]:80;

        root /var/www/application/geology-interactive-quiz/dist;
        index index.html index.htm index.nginx-debian.html;

        server_name application.local;

        location / {
                try_files $uri $uri/ /index.html;
                proxy_no_cache 1;
                proxy_cache_bypass 1;                 
        }
}    
---------------------

    sudo ln -s /etc/nginx/sites-available/application /etc/nginx/sites-enabled/

    sudo nano /etc/nginx/nginx.conf
        Uncomment: server_names_hash_bucket_size 64;

    sudo systemctl restart nginx    


8) Add autologin application user

    user: application
    password: app1

    sudo adduser application

    sudo nano /etc/gdm3/custom.conf

9) Create startup script for 'application' user

    sudo nano /var/www/application/kiosk-startup-script.sh
        Add: 
-----------------------------------------------    
#!/bin/sh
google-chrome --kiosk --incognito --disable-pinch --no-sandbox --overscroll-history-navigation=0 application.local/
-----------------------------------------------    

    sudo chmod +x /var/www/application/kiosk-startup-script.sh


    sudo nano /etc/xdg/autostart/kiosk-web-app-autostart.desktop
        Add: 
--------------------------------------------
[Desktop Entry]
Name=Kiosk Web application
Terminal=false
Exec=/var/www/application/kiosk-startup-script.sh
Type=Application
Categories=Utility;
--------------------------------------------






sudo apt-get install arp-scan
sudo arp-scan --interface=wlan0 --localnet
sudo reboot
