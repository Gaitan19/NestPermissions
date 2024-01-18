import { NestFactory } from '@nestjs/core';
import { UploadFilesModule } from './upload-files.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(UploadFilesModule);
  console.log(
    'Ruta completa del directorio estático:',
    join(__dirname, '..', 'upload-files/public/uploads'),
  );
  app.useStaticAssets(join(__dirname, '..', 'public'));
  // app.useStaticAssets(join(__dirname, 'uploads'));

  await app.listen(3005);
}
bootstrap();
