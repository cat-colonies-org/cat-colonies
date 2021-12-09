import { AuthGuard } from '@nestjs/passport';
import { CatsService } from 'src/domain/cats/cats.service';
import { Controller, Post, UseInterceptors, UploadedFiles, Param, UseGuards } from '@nestjs/common';
import { FileMetadata } from './dto/file-upload.input';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import * as Path from 'path';
import { UsersService } from 'src/domain/users/users.service';

@Controller()
export class FileUploadController {
  constructor(
    private readonly cats: CatsService,
    private readonly users: UsersService,
    private readonly uploader: FileUploadService,
  ) {}

  private hasValidExtension = (file: FileMetadata): boolean => {
    const ext = Path.extname(file.originalname).toLowerCase();
    return ['.png', '.jpg', '.jpeg', '.webp'].includes(ext);
  };

  @Post('/picture-upload/:catId')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('files'))
  async uploadPicture(@Param('catId') catId: number, @UploadedFiles() files: FileMetadata[]) {
    const cat = await this.cats.findOne(catId);
    if (!cat) return { uploaded: 0 };

    const validFiles = files.filter((file: FileMetadata) => this.hasValidExtension(file));
    for (const file of validFiles) await this.uploader.uploadPicture(catId, file);

    return { uploaded: validFiles.length };
  }

  @Post('/document-upload/:userId')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('files'))
  async uploadDocument(@Param('userId') userId: number, @UploadedFiles() files: FileMetadata[]) {
    const user = await this.users.findOne(userId);
    if (!user) return { uploaded: 0 };

    for (const file of files) await this.uploader.uploadDocument(userId, file);

    return { uploaded: files.length };
  }
}
