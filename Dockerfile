FROM node:10.15.3-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/package.json

RUN npm i --production --registry=https://registry.npm.taobao.org

COPY . /usr/src/app

EXPOSE 7001

CMD npm run docker