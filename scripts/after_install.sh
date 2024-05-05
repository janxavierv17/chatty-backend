#!/bin/bash

cd /home/ec2-user/chatty-backend

sudo rm -rf env-file.zip
sudo rm -rf .env
sudo rm -rm .env.production

aws s3 sync sync s3://janxv-env-files/production .
unzip env-file.zip

sudo cp .env.production .env
sudo pm2 delete all
sudo npm install
