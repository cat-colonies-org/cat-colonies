FROM node:16-alpine

WORKDIR /usr/local/app

COPY package.json package-lock.json tsconfig.json ./

RUN npm install

CMD ["npm", "run", "dev"]
