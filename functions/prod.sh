#!/bin/bash

cd /home/app
npm install

pm2-docker start /home/app --raw