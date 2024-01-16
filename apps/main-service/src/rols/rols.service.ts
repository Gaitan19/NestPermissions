import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';
import { HttpService } from '@nestjs/axios';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { BaseEntity } from 'typeorm';

@Injectable()
export class RolsService {
  private logger;
  constructor(
    private readonly httpService: HttpService,
    @Inject('MAIL_SERVICE') private client: ClientProxy,
  ) {
    this.logger = new Logger();
  }

  async create(createRolDto: CreateRolDto) {
    const { data } = await firstValueFrom(
      this.httpService.post(`http://localhost:4001/rols`, createRolDto).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new BadRequestException(error.response.data);
        }),
      ),
    );
    const sendResponse = this.client.send<{ type: string; data: BaseEntity }>(
      'new_created',
      {
        type: 'rol',
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
      this.httpService.get(`http://localhost:4001/rols`).pipe(
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
      this.httpService.get(`http://localhost:4001/rols/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new BadRequestException(error.response.data);
        }),
      ),
    );

    return data;
  }

  async update(id: number, updateRolDto: UpdateRolDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .patch(`http://localhost:4001/rols/${id}`, updateRolDto)
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
      this.httpService.delete(`http://localhost:4001/rols/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new BadRequestException(error.response.data);
        }),
      ),
    );

    return data;
  }
}
