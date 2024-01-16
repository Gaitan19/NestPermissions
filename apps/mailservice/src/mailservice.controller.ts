/* eslint-disable prettier/prettier */
import { BadRequestException, Controller, Get } from '@nestjs/common';
import { MailserviceService } from './mailservice.service';
import {  MessagePattern, Payload } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Email } from './emails/entities/email.entity';
import { BaseEntity, Repository } from 'typeorm';

@Controller()
export class MailserviceController {
  constructor(private readonly mailserviceService: MailserviceService,
    @InjectRepository(Email)
    private emailsRepository: Repository<Email>,) {

  }



  @Get()
  getHello(): string {
    return this.mailserviceService.getHello();
  }

  @MessagePattern('new_created')
  async handleItemCreated(@Payload() payload: { type: string; data: BaseEntity}) {


    const emailEntity = this.emailsRepository.create({
      description: `New ${payload.type.toLowerCase()} added`,
      email: JSON.stringify(payload.data),
      date: new Date(),
    });

    return await this.emailsRepository.save(emailEntity);
  }

  @MessagePattern('get_email')
  async handleGetEmail(@Payload() payload: { id: number}) {
    const email = await this.emailsRepository.findOneBy({ id:payload.id});
    if (!email) {
      throw new BadRequestException('email not found');
    }

    return email;
  }

  @MessagePattern('get_emails')
  async handleGetEmails() {
    const emails = await this.emailsRepository.find();
    return emails;
  }
}
