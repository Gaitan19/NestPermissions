/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpService } from '@nestjs/axios';
import { AxiosError, AxiosResponse } from 'axios';
import { Product } from './entities/product.entity';
import { error } from 'console';
import { catchError, firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { BaseEntity } from 'typeorm';

@Injectable()
export class ProductsService {
  private logger;
  constructor(
    private readonly httpService: HttpService,
    @Inject('MAIL_SERVICE') private client: ClientProxy,
  ) {
    this.logger = new Logger();
  }

  async create(createProductDto: CreateProductDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(`http://localhost:3001/products`, createProductDto)
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
        type: 'product',
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
      this.httpService.get(`http://localhost:3001/products`).pipe(
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
      this.httpService.get(`http://localhost:3001/products/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new BadRequestException(error.response.data);
        }),
      ),
    );

    return data;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .patch(`http://localhost:3001/products/${id}`, updateProductDto)
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
      this.httpService.delete(`http://localhost:3001/products/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new BadRequestException(error.response.data);
        }),
      ),
    );

    return data;
  }
}
