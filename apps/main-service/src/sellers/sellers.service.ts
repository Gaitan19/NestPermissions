import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { ClientProxy } from '@nestjs/microservices';
import { BaseEntity } from 'typeorm';

@Injectable()
export class SellersService {
  private logger;
  constructor(
    private readonly httpService: HttpService,
    @Inject('MAIL_SERVICE') private client: ClientProxy,
  ) {
    this.logger = new Logger();
  }
  async create(createSellerDto: CreateSellerDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(`http://localhost:3001/sellers`, createSellerDto)
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
        type: 'Seller',
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
      this.httpService.get(`http://localhost:3001/sellers`).pipe(
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
      this.httpService.get(`http://localhost:3001/sellers/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new BadRequestException(error.response.data);
        }),
      ),
    );

    return data;
  }
  async update(id: number, updateSellerDto: UpdateSellerDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .patch(`http://localhost:3001/sellers/${id}`, updateSellerDto)
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
      this.httpService.delete(`http://localhost:3001/sellers/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new BadRequestException(error.response.data);
        }),
      ),
    );

    return data;
  }
}
