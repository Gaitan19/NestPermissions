/* eslint-disable prettier/prettier */
import {
    BadRequestException,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';

import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class AuthService {
    private logger;
    constructor(
        private readonly httpService: HttpService,
        private readonly jwtService: JwtService
    ) {
        this.logger = new Logger();
    }

    async register({ password, email, rolsId }: RegisterDto) {

        const response = await firstValueFrom(
            this.httpService.post(`http://localhost:4001/users/email`, { email })
        );

        const user = response.data;


        if (user) {
            throw new BadRequestException('Email already exists');
        }


        const hashedPassword = await bcryptjs.hash(password, 10);

        const { data } = await firstValueFrom(
            this.httpService.post(`http://localhost:4001/rols/userRols`, { rolsId })
        );

        const rols = data;

        if (rols.length < rolsId.length) {
            throw new BadRequestException('Rol not found');
        }

        const newUser = {
            rolsId,
            email,
            password: hashedPassword,
        }


        const userResponse = await firstValueFrom(
            this.httpService.post(`http://localhost:4001/users`, newUser).pipe(
                catchError((error: AxiosError) => {
                    this.logger.error(error.response.data);
                    throw new BadRequestException(error.response.data);
                }),
            ),
        );


        return {
            message: 'User created successfully',
        };
    }

    async login({ email, password }: LoginDto) {
        const response = await firstValueFrom(
            this.httpService.post(`http://localhost:4001/users/email`, { email })
        );

        const user = response.data;

        if (!user) {
            throw new UnauthorizedException('Invalid email');
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        const userRoleNames = user.rols.map(role => role.rolName);
        const payload = { email: user.email, rols: userRoleNames };

        const token = await this.jwtService.signAsync(payload);

        return {
            token: token,
            email: user.email,

        };
    }
}
