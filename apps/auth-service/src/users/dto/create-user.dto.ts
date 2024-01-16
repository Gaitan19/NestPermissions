/* eslint-disable prettier/prettier */
import { IsArray, IsPositive, IsString } from 'class-validator';

export class CreateUserDto {
    @IsArray()
    @IsPositive()
    rolsId: number[];

    @IsString()
    email: string;

    @IsString()
    password: string;
}
