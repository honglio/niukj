#!/usr/bin/env bash
set -o nounset
set -o errexit

export AWS_DEFAULT_REGION="ap-southeast-1"

# Use readable variable for environment name
AWS_PLATFORM=$1
CMD=${2:-}

source config/local/env.aws-$AWS_PLATFORM.sh
: ${AWS_ACCESS_KEY_ID?"Needs AWS keys configured."}
: ${AWS_SECRET_ACCESS_KEY?"Needs AWS keys configured."}

PEMFILE=config/local/aws-$AWS_PLATFORM.pem

if [ ! -f $PEMFILE ]; then
	echo "Missing $PEMFILE"
	exit
fi

HOSTNAME=$(aws ec2 describe-instances | grep amazonaws.com | head -1 | awk '{print $2}' | sed s/[\",]//g)

cat $PEMFILE > ~/.ssh/id_rsa
chmod 600 ~/.ssh/id_rsa

echo Connecting to $HOSTNAME

ssh -t ec2-user@$HOSTNAME $CMD

rm ~/.ssh/id_rsa

