#!/bin/bash

rm -rf node_modules

if [ ! -z "$NPM_PACKAGE_JSON" ]; then
	cd $NPM_PACKAGE_JSON
	rm -rf node_modules
fi

