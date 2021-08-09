FROM node:14-alpine

WORKDIR /usr/local/app

COPY package*.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./
COPY ormconfig.json ./
COPY ./src ./
# COPY .env .

#RUN npm install --production
RUN npm install
RUN npm run build

CMD [ "node", "./dist/main.js" ]
USER node
