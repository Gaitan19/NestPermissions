import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { ClientProxy } from '@nestjs/microservices';
import { BaseEntity } from 'typeorm';

@Injectable()
export class CustomersService {
  private logger;
  constructor(
    private readonly httpService: HttpService,
    @Inject('MAIL_SERVICE') private client: ClientProxy,
  ) {
    this.logger = new Logger();
  }

  async create(createCustomerDto: CreateCustomerDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(`http://localhost:3001/customers`, createCustomerDto)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw new BadRequestException(error.response.data);
          }),
        ),
    );

    const sendResponse = this.client.send<{ type: string; data: BaseEntity }>(
      'new_created',
      {
        type: 'customer',
        data: data,
      },
    );

    sendResponse.subscribe(async (response) => {
      console.log('Respuesta del microservicio:', response);
    });

    return data;
  }

  async findAll() {
    const { data } = await firstValueFrom(
      this.httpService.get(`http://localhost:3001/customers`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new BadRequestException(error.response.data);
        }),
      ),
    );

    return data;
  }

  async findOne(id: number) {
    const { data } = await firstValueFrom(
      this.httpService.get(`http://localhost:3001/customers/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new BadRequestException(error.response.data);
        }),
      ),
    );

    return data;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .patch(`http://localhost:3001/customers/${id}`, updateCustomerDto)
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response.data);
            throw new BadRequestException(error.response.data);
          }),
        ),
    );

    return data;
  }
  async remove(id: number) {
    const { data } = await firstValueFrom(
      this.httpService.delete(`http://localhost:3001/customers/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new BadRequestException(error.response.data);
        }),
      ),
    );

    return data;
  }
}
