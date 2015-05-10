TEST_LINK_URL=http://localhost:3000

DATA_VERSION=v1.0
SECRETS_VERSION=v1.0

run:
	@killall node | echo
	@killall nodejs | echo
	@clear
	@NODE_ENV=develop node ./app.js

run-production:
	@NODE_ENV=production node ./app.js

clean:
	@git clean -xdf -e config -e .vagrant -e node_modules

npm-globals:
	@bin/scripts/install-npm-globals.sh

npm-test-updates:
	@next-update

test:
	@grunt test

tunnel:
	@lt --port 3000 --subdomain ${LOCALTUNNELNAME}

sync:
	@vagrant rsync-auto

.PHONY: sync tunnel deploy-staging deploy-production ssh-staging ssh-production run run-production clean npm-globals npm-test-updates test
