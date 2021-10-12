import { CatsService } from 'src/domain/cats/cats.service';
import { Controller, Post, UseInterceptors, UploadedFiles, Param } from '@nestjs/common';
import { FileMetadata } from './dto/file-upload.input';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import * as Path from 'path';
import { Cat } from 'src/domain/cats/entities/cat.entity';

const hasValidExtension = (file: FileMetadata): boolean => {
  const ext = Path.extname(file.originalname).toLowerCase();
  return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
};

// TODO: autorización
@Controller()
export class FileUploadController {
  constructor(private readonly cats: CatsService, private readonly uploader: FileUploadService) {}

  @Post('/file-upload/:catId')
  @UseInterceptors(FilesInterceptor('pictures'))
  async uploadPicture(@Param('catId') catId: number, @UploadedFiles() files: FileMetadata[]) {
    const cat = await this.cats.findOne(catId);
    if (!cat) return { uploaded: 0 };

    const validFiles = files.filter((file: FileMetadata) => hasValidExtension(file));
    for (const file of validFiles) await this.uploader.uploadPicture(catId, file);

    return { uploaded: validFiles.length };
  }
}
