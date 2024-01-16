/* eslint-disable prettier/prettier */
import { Transform } from 'class-transformer';
import { IsArray, IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsArray()
    rolsId: number[];
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @Transform(({ value }) => value.trim())
    password: string;
}
