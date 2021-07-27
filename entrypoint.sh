#!/bin/sh -l

ls -la
pwd
env

cd $GITHUB_WORKSPACE
ls -la

yarn global add truffle@5.1.67
yarn install 