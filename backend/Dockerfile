FROM node:14-alpine

WORKDIR /usr/local/app

COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY ormconfig.ts ./
COPY .env ./
# COPY ./src ./

#RUN npm install --production
RUN npm install
# RUN npm run build

CMD [ "npm", "run", "start:dev" ]
#USER node
