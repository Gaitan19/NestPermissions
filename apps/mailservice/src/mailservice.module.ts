import { Module } from '@nestjs/common';
import { MailserviceController } from './mailservice.controller';
import { MailserviceService } from './mailservice.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailsService } from './emails/emails.service';
import { EmailsModule } from './emails/emails.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'admin',
      database: 'mailLog',
      autoLoadEntities: true,
      synchronize: true,
    }),
    EmailsModule,
  ],
  controllers: [MailserviceController],
  providers: [MailserviceService, EmailsService],
})
export class MailserviceModule { }
