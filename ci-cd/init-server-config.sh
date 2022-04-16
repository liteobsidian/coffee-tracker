#!/bin/bash
# Using Ubuntu 20.04.1

# Скопировать ssh ключи с сервера jenkins 10.3.0.36 на новый сервер. Выполнить на 10.3.0.36
# sudo su
# su jenkins
# cat ~/.ssh/id_rsa.pub
# ssh-copy-id -i ~/.ssh/id_rsa.pub medsoft@10.3.3.12

# Установить NodeJS, yarn, pm2 (см https://github.com/nodesource/distributions/blob/master/README.md)
curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# yarn и pm2
sudo npm i -g yarn pm2@latest

# stat-app
sudo mkdir /opt/stat-app/
sudo chown -R root:medsoft /opt/stat-app/
sudo chmod -R g=rwx /opt/stat-app/

# отдельная папка для uploads, чтобы в нее можно было смонтировать отельный диск, если не будет хватать места
sudo mkdir /opt/stat-app_uploads/
sudo chown -R root:medsoft /opt/stat-app_uploads/
sudo chmod -R g=rwx /opt/stat-app_uploads/

# node-excel-report
sudo mkdir /opt/node-report/
sudo chown -R root:medsoft /opt/node-report/
sudo chmod -R g=rwx /opt/node-report/

#gotenberg
sudo mkdir /opt/gotenberg/
sudo chown -R root:medsoft /opt/gotenberg/
sudo chmod -R g=rwx /opt/gotenberg/

# Скопировать бинарник gotenberg и gotenberg.sh
cp -r ~/_deploy/gotenberg/gotenberg /opt/gotenberg/
cp -r ~/_deploy/gotenberg/gotenberg.sh /opt/gotenberg/
sudo chmod +x /opt/gotenberg/gotenberg.sh
sudo chmod +x /opt/gotenberg/gotenberg

# ставим хромиум для gotenberg
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i --force-depends google-chrome-stable_current_amd64.deb
# или sudo apt install chromium-browser # apt --fix-broken install

# logs
sudo mkdir /var/log/stat-app/
sudo chown -R root:medsoft /var/log/stat-app/
sudo chmod -R g=rwx /var/log/stat-app/


