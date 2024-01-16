import { Inject, Injectable } from '@nestjs/common';
import { CreateEmailLogDto } from './dto/create-email-log.dto';
import { UpdateEmailLogDto } from './dto/update-email-log.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class EmailLogsService {
  constructor(@Inject('MAIL_SERVICE') private client: ClientProxy) {}

  create(createEmailLogDto: CreateEmailLogDto) {
    return 'This action adds a new emailLog';
  }

  async findAll() {
    const sendResponse = await this.client.send('get_emails', {});

    sendResponse.subscribe(async (response) => {
      console.log('Respuesta del microservicio:', response);
    });

    return sendResponse;
  }

  async findOne(id: number) {
    const sendResponse = await this.client.send('get_email', { id });

    sendResponse.subscribe(async (response) => {
      console.log('Respuesta del microservicio:', response);
    });
    return sendResponse;
  }

  update(id: number, updateEmailLogDto: UpdateEmailLogDto) {
    return `This action updates a #${id} emailLog`;
  }

  remove(id: number) {
    return `This action removes a #${id} emailLog`;
  }
}
