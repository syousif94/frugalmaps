#!/bin/bash

rm -rf public
cd buncha
expo build:web
mv web-build ../public
cp web/favicon.png ../public/favicon.png
firebase deploy --only hosting