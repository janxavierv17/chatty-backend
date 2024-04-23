#!/bin/bash

function isProgramInstalled {
    local return_=1
    echo "[isProgramInstalled] - start"
    
    type $1 >/dev/null 2>&1 || { local return_=0; }
    
    echo "[isProgramInstalled] - end"
    echo "$return_"
}

sudo yum update -y

# Check if Node.js is installed. If not, install it
if [ $(isProgramInstalled node) == 0 ]; then
    echo "Installing Node.js ..."
    
    curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
    yum install -y nodejs
    
    echo "Done installing Node.js ..."
else
    echo "Node.js is already installed."
fi

if [ $(isProgramInstalled git) == 0 ]; then
    echo "Installing git ..."
    
    sudo yum install git -y
    
    echo "Done installing git."
else
    echo "Git is already installed."
fi

if [ $(isProgramInstalled docker) == 0 ]; then
    echo "Installing docker ..."
    
    sudo amzon-linux-extras install docker -y
    sudo systemctl start docker
    sudo docker run --name chatapp-redis -p 6379:6379 --restart always --detach redis

    echo "Done installing docker."
else
    echo "Docker is already installed."
fi

if [ $(isProgramInstalled pm2) == 0 ]; then
    echo "Installing pm2 ..."
    
    npm i -g pm2

    echo "Done installing pm2."
else
    echo "PM2 is already installed globally."
fi

cd /home/ec2-user
git clone -b develop https://github.com/janxavierv17/chatty-backend.git
cd chatty-backend
npm i
aws s3 sync s3://chatapp-env-files/develop .
unzip env-file.zip
cp .env.develop .env
npm run build
npm start