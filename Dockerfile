FROM node:13.14-alpine

EXPOSE 8080


# Create app directory
WORKDIR /app/relayer

RUN apk update && apk upgrade && \
  apk add --no-cache git make gcc g++ python


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

COPY contracts/deployed.json ../contracts/deployed.json 
COPY lib ../lib
COPY build ../build
COPY relayer/package*.json .
COPY relayer/yarn.lock .
COPY relayer/index.js .
COPY relayer/src ./src
COPY relayer/releases ./releases
RUN yarn install

COPY package*.json ../
COPY yarn.lock ../
RUN cd .. && yarn install 

CMD [ "yarn","server" ]
