#!/bin/bash

cd /home/ec2-user/chatty-backend
sudo rm -rf node_modules
sudo npm i
sudo npm run build
sudo npm start
