import { NestFactory } from '@nestjs/core';
import { TestingModule } from './testing.module';

async function bootstrap() {
  const app = await NestFactory.create(TestingModule);
  await app.listen(3000);
}
bootstrap();
