import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import SettingsService from './settings/settings.service';

const CR_PATH = '/etc/letsencrypt/live/colonias.cincohocicos.com/fullchain.pem';
const PK_PATH = '/etc/letsencrypt/live/colonias.cincohocicos.com/privkey.pem';

const httpsOptions: any = {};

if (fs.existsSync(CR_PATH) && fs.existsSync(PK_PATH)) {
  httpsOptions.cert = fs.readFileSync(CR_PATH);
  httpsOptions.key = fs.readFileSync(PK_PATH);
} else {
  console.log(`${CR_PATH}: ${fs.existsSync(CR_PATH)}`);
  console.log(`${PK_PATH}: ${fs.existsSync(PK_PATH)}`);
}

(async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
    cors: true,
  });
  const settings: SettingsService = app.get(SettingsService);
  const port: number = settings.port;

  await app.listen(port);

  console.log(`Service listening on port ${port}`);
  console.log(`SSL certificate: ${httpsOptions.cert ? 'available' : 'unavailable'}`);
  console.log(`SSL key: ${httpsOptions.key ? 'available' : 'unavailable'}`);
})();
