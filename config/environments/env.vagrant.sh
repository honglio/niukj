# Vagrant Environment Variables file

# These variables are used in two ways:
#  - During Vagrant creation and provisioning
#  - Sourced by .bash_profile for use by the application inside the Vagrant VM

# DO NOT change these values directly unless it is a permanent change.
# If you need to override them temporarily, create file env.local.sh in ../local/

# Vagrant box
export VAGRANT_BOX_NAME=thomas.140320
export VAGRANT_BOX_URL=ftp://192.168.1.6/dev/honglio.box
export VAGRANT_CPU_CAP=100
export VAGRANT_MEMORY=512
export VAGRANT_CPUS=1
export VAGRANT_SHARE_MODE=default

# Vagrant host port forwarding
export VAGRANT_NODEJS_HOST_PORT=3000
export VAGRANT_PG_HOST_PORT=5432

# Port settings
export PORT=3000
export THROTTLE_PORT=3001
export PGPORT=5432
export KLSG_LIVERELOAD_PORT=35729

# Other Postgres settings
export PGUSER=keylocationsg
export PGPASSWORD=devpg
export PGHOST=127.0.0.1

# App configuration
export KLSG_LIVERELOAD=true
export PGUSER=keylocationsg
export PGPASSWORD=devpg

# Mail configuration
export KLSG_SMTP_PORT=3025
export KLSG_SMTP_NO_TLS=true
export KLSG_SMTP_DEV=true

git config --global core.editor nano
git config --global color.ui true

export KLSG_MINIFY_BUILDS=false
export KLSG_BUILD_ON_START=true

# Windows hosts can't support symlinks
export NPM_CONFIG_BIN_LINKS=false
export NPM_CONFIG_FETCH_RETRIES=5

# Custom npm install location
export NPM_CONFIG_PREFIX=/home/vagrant/.npm-packages
export NPM_PACKAGE_JSON=$NPM_CONFIG_PREFIX/lib
export NODE_MODULES=$NPM_PACKAGE_JSON/node_modules
export PATH=$NPM_CONFIG_PREFIX/bin:$PATH
export NODE_PATH=$NODE_MODULES:$NODE_PATH

# Bing search images for condo page
export KLSG_BING_KEY=mYWkXdpPJuREXcKdkafZqkK6qkstnOZ4pD39y2MeQEw=

# Auth
export AUTH_FACEBOOK_CALLBACKURL=http://localhost:3000/auth/facebook/callback
export AUTH_GOOGLE_CALLBACKURL=http://localhost:3000/auth/google/callback

# Blog
export BLOG_ENABLE=true
export BLOG_DEV=true

# Unset manpath so we can inherit from /etc/manpath via the `manpath`
# command
unset MANPATH
export MANPATH=$NPM_CONFIG_PREFIX/share/man:$(manpath)


# Display git branch name and colours on command prompt
function parse_git_branch {
    git branch --no-color 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/(\1) /'
}
PS1="\[\e[32m\]\$(parse_git_branch)\[\e[33m\]\h:\w \$ \[\e[m\]"
export PS1

export SHOW_ERRORS_ON_500_PAGE=true

export LOCALTUNNELNAME=klsg
