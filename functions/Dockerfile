FROM node:12-alpine

RUN apk add --no-cache openssl
RUN apk add --update --no-cache gcc g++ make libc6-compat python
RUN apk add vips-dev fftw-dev build-base --no-cache \
  --repository http://dl-3.alpinelinux.org/alpine/edge/community/ \
  --repository http://dl-3.alpinelinux.org/alpine/edge/main


ENV HOME=/home/app

RUN mkdir $HOME \
  && npm install pm2 -g