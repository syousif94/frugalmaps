FROM node:12-alpine

RUN apk add --no-cache openssl
ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

RUN apk add --update --no-cache gcc g++ make libc6-compat python
RUN apk add vips-dev fftw-dev build-base --no-cache \
  --repository http://dl-3.alpinelinux.org/alpine/edge/community/ \
  --repository http://dl-3.alpinelinux.org/alpine/edge/main


ENV HOME=/home/app

RUN mkdir $HOME \
  && npm install pm2 -g