#!/bin/bash

cd /home/app
npm install

dockerize -wait http://es01:9200

pm2-docker start /home/app --raw --watch