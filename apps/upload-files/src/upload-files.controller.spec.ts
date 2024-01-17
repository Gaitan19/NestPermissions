import { Test, TestingModule } from '@nestjs/testing';
import { UploadFilesController } from './upload-files.controller';
import { UploadFilesService } from './upload-files.service';

describe('UploadFilesController', () => {
  let uploadFilesController: UploadFilesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UploadFilesController],
      providers: [UploadFilesService],
    }).compile();

    uploadFilesController = app.get<UploadFilesController>(UploadFilesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(uploadFilesController.getHello()).toBe('Hello World!');
    });
  });
});
