#!/bin/bash
source common.sh
message "Setting up webserver..."

message "Copy virtual host config"
sudo mkdir -p /etc/nginx/sites-enabled
sudo cp config/default.nginx /etc/nginx/sites-enabled/

message "Add include path to nginx.conf"
nginxConfigFile='/etc/nginx/nginx.conf'
httpPos = $(grep -n -F -w 'http {' /etc/nginx/nginx.conf | grep -o '[0-9]\+')
((httpPos++))
if [[  httpPos ]]
then
  sudo cp $nginxConfigFile $nginxConfigFile'.bak'
  sudo sed -i $httpPos'i include /etc/nginx/sites-enabled/*' $nginxConfigFile
fi

message "Create /var/www/html directory and copy application files"
sudo mkdir -p /var/www/html
sudo cp -rv ../dist/* /var/www/html/

message "Enable nginx service & restart"
sudo systemctl enable --now nginx
sudo systemctl restart nginx

message "Add hosts file entry"
sudo echo '127.0.0.1  application.local' >> /etc/hosts



