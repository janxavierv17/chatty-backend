#!/bin/bash

# Uploading to s3 using the cli with the command below
# aws --region ap-southeast-2 s3 cp env-file.zip s3://janxv-env-files/develop/

function isProgramInstalled {
  type "$1" &>/dev/null
}

if [ $(isProgramInstalled zip) == 0 ]; then
  apk update
  apk add zip
fi

# Download every content in the develop folder
aws s3 sync s3://janxv-env-files/develop .

# Unzip the downloaded file
unzip env-file.zip

# Copy the prod env and create a .env out of it
cp .env.develop .env
rm .env.develop

# Replace our redis endpoint from local host to our elasticache.
sed -i -e "s|\(^REDIS_HOST=\).*|REDIS_HOST=redis://$ELASTICACHE_ENDPOINT:6379|g" .env

rm -rf env-file.zip
cp .env .env.develop

zip env-file.zip .env.develop

aws --region ap-southeast-2 s3 cp env-file.zip s3://janxv-env-files/develop/

rm -rf .env*
rm -rf env-file.zip
