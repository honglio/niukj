#!/usr/bin/env bash
set -o nounset
set -o errexit

# g++ is needed for one of the npm installs. Will be moved to the packer VM eventually.
echo INSTALLING APT-GET PACKAGES
apt-get -y install g++
apt-get -y install vim-nox
apt-get install -y python-software-properties
add-apt-repository -y ppa:rwky/redis
apt-get update
apt-get install -y redis-server
apt-get install -y fontforge rake
apt-get install -y dos2unix
apt-get install -y libtool automake autoconf nasm
apt-get install -y imagemagick graphicsmagick
apt-get install -y libjpeg62 libjpeg62-dev zlib1g-dev python-dev libpng-dev
# apt-get install -y mongodb-org=2.6.1 mongodb-org-server=2.6.1 mongodb-org-shell=2.6.1 mongodb-org-mongos=2.6.1 mongodb-org-tools=2.6.1


echo SETTING ENVIRONMENT VARIABLES
echo "source /vagrant/config/environments/env.vagrant.sh" > /home/vagrant/.bash_profile
echo "[ -f /vagrant/config/local/env.local.sh ] && dos2unix /vagrant/config/local/env.local.sh && source /vagrant/config/local/env.local.sh" >> /home/vagrant/.bash_profile
echo "alias env-reload='source /home/vagrant/.bash_profile;env'" >> /home/vagrant/.bash_profile
echo "alias klsg='env-reload;cd /vagrant;make'" >> /home/vagrant/.bash_profile
echo "alias git='hub'" >> /home/vagrant/.bash_profile
echo "alias merge='/vagrant/bin/scripts/merge_pull_request.sh'" >> /home/vagrant/.bash_profile
echo "cd /vagrant" >> /home/vagrant/.bash_profile
source /home/vagrant/.bash_profile

echo INSTALLING git-extras
[ ! -d /tmp/git-extras ] && cd /tmp && git clone --depth 1 https://github.com/visionmedia/git-extras.git && cd git-extras && sudo make install

#echo INSTALLING hub
#[ ! -d /tmp/hub ] && cd /tmp && git clone git://github.com/github/hub.git && cd hub && sudo rake install

# echo INSTALLING grunt-contrib-imagemin
# npm install -g imagemin chalk grunt-contrib-imagemin

[ ! -d /home/vagrant/.npm-packages ] && mkdir /home/vagrant/.npm-packages
sudo chown -R vagrant:vagrant /home/vagrant

cd /vagrant
# make install-testing
sudo make npm-globals
# make npm
# make component-build
# make seed

# if [ $VAGRANT_SHARE_MODE != 'rsync' ]; then
	# [ ! -d /vagrant/.git/hooks ] && mkdir /vagrant/.git/hooks
	# cp /vagrant/bin/scripts/pre-commit /vagrant/.git/hooks/
	# chmod +x /vagrant/.git/hooks/pre-commit

	# PARTY=${COMMIT_PARTY:-}
	# if [ ! -z ${PARTY} ]; then
	# 	rm /vagrant/.git/hooks/pre-commit
	# fi
# else
# 	chown -R vagrant:vagrant /vagrant
# fi

sudo chown -R vagrant:vagrant /vagrant


# rm -rf /vagrant/data/db/*
# sudo service mongod start

echo DONE!
echo " "
echo To start the webapp:
echo   vagrant ssh
echo   make
echo " "
echo "You can then access the webapp via http://localhost:$VAGRANT_NODEJS_HOST_PORT"
