TEST_LINK_URL=http://localhost:3000

DATA_VERSION=v0.0
SECRETS_VERSION=v0.1

run:
	@killall node | echo
	@killall nodejs | echo
	@clear
	@node ./app.js

run-production:
	@NODE_ENV=production node ./app.js

clean-public:
	@rm -rf public

clean-npm:
	@bin/scripts/clean-npm.sh

clean: clean-public
	@git clean -xdf -e config -e .vagrant -e node_modules

clean-all: clean-npm clean

npm-globals:
	@bin/scripts/install-npm-globals.sh

build: npm component-build condo-thumbnails blog seed

build-production: component-build condo-thumbnails clean-npm npm-production

rebuild: clean build

rebuild-production: clean build-production

build-all: npm-globals build

rebuild-all: clean build-all

codeship: build-all

vagrant: rebuild-all

npm-test-updates:
	@next-update

test:
	@ grunt test

tunnel:
	@lt --port 3000 --subdomain ${LOCALTUNNELNAME}

sync:
	@vagrant rsync-auto

deploy-staging: rebuild-production
  @bin/scripts/aws-deploy.sh AWS-Staging

deploy-production: rebuild-production
  @bin/scripts/aws-deploy.sh AWS-Production

ssh-staging:
  @bin/scripts/aws-ssh.sh staging

ssh-production:
  @bin/scripts/aws-ssh.sh production

.PHONY: sync tunnel deploy-staging deploy-production ssh-staging ssh-production run run-production clean-public clean-npm clean clean-all npm-globals npm-test-updates build build-production build-all rebuild rebuild-production rebuild-all test vagrant codeship
