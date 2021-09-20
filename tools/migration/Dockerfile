FROM node:16-slim

WORKDIR /usr/local/app

RUN apt-get update && apt-get install -y mdbtools

COPY ./package.json ./main.js ./
RUN npm install

CMD [ "npm", "start" ]
#USER node
