FROM node:16-alpine

WORKDIR /usr/local/app

COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN npm install -g @nestjs/cli
RUN npm install

CMD [ "npm", "run", "start:dev" ]
#USER node
