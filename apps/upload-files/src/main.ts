import { NestFactory } from '@nestjs/core';
import { UploadFilesModule } from './upload-files.module';

async function bootstrap() {
  const app = await NestFactory.create(UploadFilesModule);
  await app.listen(3000);
}
bootstrap();
