#!/bin/bash

rsync -azP functions/ ubuntu@sprinkle.ideakeg.xyz:/home/ubuntu/frugal --exclude node_modules --exclude .DS_Store --exclude .pm2 --exclude .config --exclude .node-gyp --exclude .npm --exclude elasticsearch --exclude package-lock.json --exclude .cache
ssh ubuntu@sprinkle.ideakeg.xyz 'cd frugal; sudo docker-compose restart; exit;'