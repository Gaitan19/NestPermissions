/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  BadRequestException,
  Header,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, renameImage } from './helpers/images.helper';
import * as fs from 'fs';
import * as path from 'path';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  uploadFile(@Body() body: { image: string }) {
    try {
      const base64Image = body.image.split(';base64,').pop();
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `image-${uniqueSuffix}.png`;
      const imagePath = path.join('./public/uploads', filename);

      fs.writeFileSync(imagePath, base64Image, { encoding: 'base64' });

      return {
        path: imagePath,
        filename,
      };
    } catch (error) {
      console.log('error :>> ', error);
      return {
        error: 'Error al procesar la imagen',
      };
    }
  }

  // @Post('upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './public/uploads',
  //       filename: renameImage,
  //     }),
  //     fileFilter: fileFilter,
  //   }),
  // )
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log('file', file);
  // }

  @Post()
  create(@Body() createFileDto: CreateFileDto) {
    return this.filesService.create(createFileDto);
  }

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
