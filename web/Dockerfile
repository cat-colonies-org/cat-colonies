FROM node:16-alpine

WORKDIR /usr/local/app

COPY package.json package-lock.json tsconfig.json .env.development .env.production .eslintrc.js next-env.d.ts ./

RUN npm install

CMD ["npm", "run", "dev"]
