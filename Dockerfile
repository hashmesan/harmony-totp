FROM node:10.15-alpine

EXPOSE 8080

RUN npm install -g yarn nodemon

# Create app directory
WORKDIR /app/relayer

RUN apk update && apk upgrade && \
	apk add --no-cache git make gcc g++ python


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)

COPY lib ../lib
COPY build ../build
COPY relayer/package*.json .
COPY relayer/yarn.lock .
COPY relayer/index.js .
COPY relayer/src ./src
RUN yarn install

COPY package*.json ../
COPY yarn.lock ../
RUN cd .. && yarn install 

CMD [ "yarn","server" ]