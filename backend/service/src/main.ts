import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';

const crPath = '/etc/letsencrypt/live/colonias.cincohocicos.com/fullchain.pem';
const pkPath = '/etc/letsencrypt/live/colonias.cincohocicos.com/privkey.pem';
const sslOptions: any = {};

if (fs.existsSync(crPath) && fs.existsSync(pkPath)) {
  sslOptions.httpsOptions = {
    cert: fs.readFileSync(crPath),
    key: fs.readFileSync(pkPath),
  };
}

(async function bootstrap() {
  const app = await NestFactory.create(AppModule, { ...sslOptions, cors: true });
  const port: number = sslOptions.cert ? 443 : 80;

  await app.listen(port);

  console.log(`Service listening on port ${port}`);
})();
