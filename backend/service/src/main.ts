import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import SettingsService from './settings/settings.service';

(async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const settings: SettingsService = app.get(SettingsService);
  const port: number = settings.port;

  await app.listen(port);

  console.log(`Service listening on port ${port}`);
})();
