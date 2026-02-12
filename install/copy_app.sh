#!/bin/bash
source common.sh
message "Copy application files..."
sudo cp -rv ../dist/* /var/www/html/

