import { CatsModule } from 'src/domain/cats/cats.module';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';
import { Module } from '@nestjs/common';
import { PicturesModule } from 'src/domain/pictures/pictures.module';
import { SettingsModule } from 'src/settings/settings.module';
import { UsersModule } from 'src/domain/users/users.module';
import { DocumentsModule } from 'src/domain/documents/documents.module';

@Module({
  imports: [CatsModule, UsersModule, DocumentsModule, PicturesModule, SettingsModule],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule {}
