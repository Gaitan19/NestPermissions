import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpService } from '@nestjs/axios';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import { BaseEntity } from 'typeorm';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class UsersService {
  private logger;
  constructor(
    private readonly httpService: HttpService,
    @Inject('MAIL_SERVICE') private client: ClientProxy,
  ) {
    this.logger = new Logger();
  }
  async create(createUserDto: CreateUserDto) {
    const { data } = await firstValueFrom(
      this.httpService.post(`http://localhost:4001/users`, createUserDto).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new BadRequestException(error.response.data);
        }),
      ),
    );
    const sendResponse = this.client.send<{ type: string; data: BaseEntity }>(
      'new_created',
      {
        type: 'user',
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
      this.httpService.get(`http://localhost:4001/users`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new BadRequestException(error.response.data);
        }),
      ),
    );

    return data;
  }

  async register(registerDto: RegisterDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .post(`http://localhost:4002/auth/register`, registerDto)
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
        type: 'user',
        data: registerDto,
      },
    );

    sendResponse.subscribe(async (response) => {
      console.log('Respuesta del microservicio:', response);
    });
    return data;
  }

  async login(loginDto: LoginDto) {
    const { data } = await firstValueFrom(
      this.httpService.post(`http://localhost:4002/auth/login`, loginDto).pipe(
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
      this.httpService.get(`http://localhost:4001/users/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new BadRequestException(error.response.data);
        }),
      ),
    );

    return data;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .patch(`http://localhost:4001/users/${id}`, updateUserDto)
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
      this.httpService.delete(`http://localhost:4001/users/${id}`).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw new BadRequestException(error.response.data);
        }),
      ),
    );

    return data;
  }
}
