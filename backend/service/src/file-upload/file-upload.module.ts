import { CatsModule } from 'src/domain/cats/cats.module';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { Module } from '@nestjs/common';
import { PicturesModule } from 'src/domain/pictures/pictures.module';
import { SettingsModule } from 'src/settings/settings.module';

@Module({
  imports: [CatsModule, PicturesModule, SettingsModule],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
