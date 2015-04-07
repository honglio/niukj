#!/usr/bin/env bash
set -o nounset
set -o errexit

export AWS_DEFAULT_REGION="ap-southeast-1"
export AWS_DEFAULT_OUTPUT="table"

: ${DEPLOY_ENABLED?"Deploying isn't enabled in this environment"}

#TODO: Add check for uncommitted files

# Use readable variable for environment name
AWS_PLATFORM=$1

# Use git revision plus timestamp used for application version
# The timestamp ensures that the same git revision can be pushed multiple times, just like git aws.push allows
APPLICATION_VERSION=`git rev-parse --short HEAD`-$(date +%Y%m%d-%H.%M.%S)

# Temporary zip file. Keeping it out of repository
DEPLOY_FILE=/tmp/git-$APPLICATION_VERSION.zip

case $AWS_PLATFORM in
    AWS-Staging)
        PROFILE=staging
        ;;
    AWS-Production)
        PROFILE=production
        ;;
    *)
        echo -e "\e[31mUnknown platform $AWS_PLATFORM. Exiting.\e[0m"
        echo
        exit
esac

source config/environments/env.aws-$PROFILE.sh
[ -f config/local/env.aws-$PROFILE.sh ] && source config/local/env.aws-$PROFILE.sh

: ${AWS_ACCESS_KEY_ID?"Needs AWS keys configured."}
: ${AWS_SECRET_ACCESS_KEY?"Needs AWS keys configured."}
: ${S3_BUCKET?"Needs S3 bucket configured."}
: ${APP_NAME?"Needs App name configured."}
: ${ENV_NAME?"Needs Env name configured."}

echo
echo Deploying project to $1
echo

echo COPYING EBEXTENSIONS CONFIG FILES
# Copy config files to .ebextensions directory
if [ ! -d .ebextensions ]; then
    mkdir .ebextensions
fi
rm -rf .ebextensions/*
cp -R config/environments/ebextensions/aws-all/* .ebextensions/
cp -R config/environments/ebextensions/aws-$PROFILE/* .ebextensions/

echo -e "\e[32mDone!\e[0m"
echo

echo ZIPPING UP DEPLOYMENT FILES
# Beware: Excluded files here are not the same as .gitignore.
# Most of these files could be uploaded but we skip them to save space
zip -r $DEPLOY_FILE . -x "*.git*" "*node_modules*" "*.DS_Store*" ".vagrant/*" "bin/vagrant/*" "test/*" ".idea/*" ".elasticbeanstalk/*" "bin/aws/*" "bin/scraping/*" "bin/other/*" "bin/data/*" "config/local/*" "config/environments/*" "log/*" "tmp/*" "logs/*" "coverage/*" "lib/client/*" Vagrantfile
rm -rf .ebextensions
echo -e "\e[32mDone!\e[0m"
echo

echo COPYING DEPLOY FILE TO AWS S3
aws s3 cp $DEPLOY_FILE s3://$S3_BUCKET/git-$APPLICATION_VERSION.zip
echo -e "\e[32mDone!\e[0m"
echo

#echo TRIMMING OLD APPLICATION VERSIONS
# Leave the last 100. Maximum allowed is 500.
#aws elasticbeanstalk describe-application-versions --application-name $APP_NAME | grep VersionLabel | sed '1,100d' | awk '{print $2}' | sed 's/[",\,]//g' | awk '{print "aws elasticbeanstalk delete-application-version --application-name $APP_NAME --delete-source-bundle --version-label "$0}' | sh

echo CREATING ELASTIC BEANSTALK APPLICATION VERSION
aws elasticbeanstalk create-application-version --application-name $APP_NAME --version-label $APPLICATION_VERSION --source-bundle S3Bucket=$S3_BUCKET,S3Key=git-$APPLICATION_VERSION.zip
echo -e "\e[32mDone!\e[0m"
echo

echo UPDATING ELASTIC BEANSTALK ENVIRONMENT
aws elasticbeanstalk update-environment --environment-name $ENV_NAME --version-label $APPLICATION_VERSION
echo -e "\e[32mDone!\e[0m"
echo

echo Deploy script has finished. AWS will take about a minute to update to the new version.
echo
