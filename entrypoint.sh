#!/bin/sh -l

env
cd $GITHUB_WORKSPACE
yarn global add truffle@5.1.67
yarn global add ganache-cli@6.12.2
yarn install 
mv secrets.js.template secrets.js
tar xvf ganache-db.tar 
sh ganache.sh|tee ganache.log > /dev/null &
truffle test
