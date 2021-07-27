#!/bin/sh -l

ls -la
pwd
env

cd $GITHUB_WORKSPACE
ls -la

yarn global add truffle@5.1.67
yarn global add ganache-cli@6.12.2
yarn install 
mv secrets.js.template secrets.js
tar xvf ganache-db.tar 
ls -la ganache-db
sh ganache.sh &
truffle test
