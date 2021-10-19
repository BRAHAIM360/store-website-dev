FROM node:10

COPY ./package.json /src/
COPY ./yarn.lock /src/

WORKDIR /src

RUN yarn

EXPOSE 3002
