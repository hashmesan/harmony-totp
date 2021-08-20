# Webclient

Webclient is the webclient for Smartvault which is built with React, redux-zero, and react-router. 

## Pre-requisites

Build smart contracts with truffle (see /contracts)
Requires relayer

## Install dependencies

```
cd .. && truffle build
yarn
```

## Development

```
yarn dev
```

Visit http://localhost:8082

## Deployment

Deployment uses gh-pages package to package and deploy to the gh-pages branch, and push to the repo.

```
yarn build && yarn deploy
```