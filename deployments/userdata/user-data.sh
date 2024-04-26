#!/bin/bash
function isProgramInstalled {
    type "$1" &>/dev/null
}

sudo yum update -y

# Check if Node.js is installed. If not, install it
if ! isProgramInstalled node; then
  curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
  yum install -y nodejs
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
sudo aws s3 sync s3://janxv-env-files/develop .
sudo unzip env-file.zip
sudo cp .env.develop .env
npm run build
npm run start

