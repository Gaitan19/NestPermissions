import { NestFactory } from '@nestjs/core';
import { MailserviceModule } from './mailservice.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  //const app = await NestFactory.create(MailserviceModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MailserviceModule,
    {
      transport: Transport.TCP,
    },
  );
  await app.listen();
}
bootstrap();
