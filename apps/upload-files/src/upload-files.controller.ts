import { Controller, Get } from '@nestjs/common';
import { UploadFilesService } from './upload-files.service';

@Controller()
export class UploadFilesController {
  constructor(private readonly uploadFilesService: UploadFilesService) {}

  @Get()
  getHello(): string {
    return this.uploadFilesService.getHello();
  }
}
