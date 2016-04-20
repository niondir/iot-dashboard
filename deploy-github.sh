#!/bin/bash
set -o errexit -o nounset

CNAME="demo.iot-dashboard.org"
#BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)
BRANCH_NAME=${TRAVIS_BRANCH}
REV=$(git rev-parse --short HEAD)

rm -rf _deployment
mkdir _deployment
cd _deployment

echo "Initializing and configuring git.."
git init
git config user.name "Travis CI"
git config user.email "noreply@iot-dashboard.org"

echo "Setting upstream and branch..."
git remote add upstream "https://$GH_TOKEN@github.com/niondir/iot-dashboard"
git fetch upstream
git checkout upstream/gh-pages

echo ${CNAME} > CNAME

touch .

echo "Updating ${BRANCH_NAME} folder"

TARGET_DIR="./branch/${BRANCH_NAME}/"

git rm -rf --ignore-unmatch ${TARGET_DIR}

mkdir -p ${TARGET_DIR}
cp -r ../dist/* ${TARGET_DIR}

echo "Git add, commit and pushing..."

git add -A .
git commit -m "Deploying branch ${BRANCH_NAME} @ ${REV} to GitHub pages"
git push -q upstream HEAD:gh-pages

echo "Deployed on http://${CNAME}/branch/${BRANCH_NAME}/"