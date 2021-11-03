FROM node:13.14-alpine

EXPOSE 8080


# Create app directory
WORKDIR /app/relayer

RUN apk update && apk upgrade && \
	apk add --no-cache git make gcc g++ python


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

COPY package*.json ../
COPY yarn.lock ../
RUN cd .. && yarn install 

COPY relayer/package*.json .
COPY relayer/yarn.lock .
RUN yarn install

COPY lib ../lib
COPY build ../build
COPY contracts/deployed.json ../contracts/deployed.json 
COPY relayer/index.js .
COPY relayer/run_indexer.js .
COPY relayer/src ./src
COPY relayer/releases ./releases
COPY webclient/src/config.js ../webclient/src/config.js

CMD [ "yarn","server" ]
