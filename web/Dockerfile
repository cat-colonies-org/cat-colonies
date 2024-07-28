FROM node:20.16.0-alpine3.20

WORKDIR /usr/local/app

COPY package.json package-lock.json tsconfig.json .env.development .env.production .eslintrc.js next-env.d.ts ./

RUN npm install

CMD ["npm", "run", "dev"]
