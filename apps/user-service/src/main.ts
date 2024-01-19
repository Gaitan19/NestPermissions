import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './user-service.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(UserServiceModule);
  app.useStaticAssets(join(__dirname, '..', '../../public'));
  await app.listen(4001);
}
bootstrap();
