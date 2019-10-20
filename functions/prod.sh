#!/bin/bash

cd /home/app
npm install --production

dockerize -wait http://es01:9200 -timeout 25s

pm2-docker start /home/app --raw