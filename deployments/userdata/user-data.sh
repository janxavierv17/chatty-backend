#!/bin/bash

function isProgramInstalled {
    local return_=1
    
    type $1 >/dev/null 2>&1 || { local return_=0; }
    echo "$return_"
}

sudo yum update -y

function isProgramInstalled {
    type "$1" &>/dev/null
}

sudo yum update -y

# Check if Node.js is installed. If not, install it
if ! isProgramInstalled node; then
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
  
  echo "Enabling nvm ..."
  source ~/.bashrc

  nvm install 16
  node -e "console.log('Running Node.js ' + process.version)"
fi

if ! isProgramInstalled git; then
  sudo yum install git -y
fi

if ! isProgramInstalled docker; then
  sudo amazon-linux-extras install docker -y
  sudo systemctl start docker
  sudo docker run --name chatapp-redis -p 6379:6379 --restart always --detach redis
fi

if ! isProgramInstalled pm2; then
  sudo npm i -g pm2
fi

cd /home/ec2-user
git clone -b feature/terraform-state https://github.com/janxavierv17/chatty-backend.git
cd chatty-backend
npm i
aws s3 sync s3://chatapp-env-files/develop .
unzip env-file.zip
cp .env.develop .env
npm run build
npm start