import { IsArray, IsEmail, IsPositive, IsString } from 'class-validator';

export class CreateUserDto {
  @IsArray()
  @IsPositive()
  rolsId: number[];

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
