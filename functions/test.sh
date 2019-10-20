#!/bin/bash

cd /home/app
npm install

dockerize -wait http://es01:9200

npm run test