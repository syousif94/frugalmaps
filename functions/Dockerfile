FROM node:12-alpine

RUN apk add --no-cache openssl

ENV HOME=/home/app

RUN mkdir $HOME \
  && npm install pm2 -g