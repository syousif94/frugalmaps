#!/bin/bash

rm -rf public
cd buncha
expo build:web
mv web-build ../public
firebase deploy --only hosting