#!/bin/bash

echo INSTALLING GLOBAL NPM MODULES

if [ ! -f /usr/bin/grunt ]; then
  npm install -g grunt-cli
else
  echo "Skipping grunt-cli - already installed"
fi

if [ ! -f /usr/bin/mocha ]; then
  npm install -g mocha
else
  echo "Skipping mocha - already installed"
fi

if [ ! -f /usr/bin/lt ]; then
  npm install -g localtunnel
else
  echo "Skipping localtunnel - already installed"
fi

if [ ! -f /usr/bin/next-update ]; then
  npm install -g next-update
else
  echo "Skipping next-update - already installed"
fi
