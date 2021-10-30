import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import * as fs from 'fs';
import SettingsService from './settings/settings.service';

const CR_PATH = '/etc/letsencrypt/live/colonias.cincohocicos.com/fullchain.pem';
const PK_PATH = '/etc/letsencrypt/live/colonias.cincohocicos.com/privkey.pem';

(async function bootstrap() {
  const options: any = {
    cors: true,
  };

  if (fs.existsSync(CR_PATH) && fs.existsSync(PK_PATH)) {
    options.httpsOptions = {
      cert: fs.readFileSync(CR_PATH),
      key: fs.readFileSync(PK_PATH),
    };
  }

  const app = await NestFactory.create(AppModule, options);
  const settings: SettingsService = app.get(SettingsService);
  const port: number = settings.port;

  await app.listen(port);

  console.log(`Service listening on port ${port}`);
  console.log();
  console.log(`${CR_PATH}: ${fs.existsSync(CR_PATH)}`);
  console.log(`${PK_PATH}: ${fs.existsSync(PK_PATH)}`);
  console.log();
  console.log(`SSL certificate: ${options.httpsOptions?.cert ? 'available' : 'unavailable'}`);
  console.log(`SSL key: ${options.httpsOptions?.key ? 'available' : 'unavailable'}`);
})();
