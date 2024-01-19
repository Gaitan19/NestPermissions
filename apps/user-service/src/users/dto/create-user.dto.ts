import {
  IsArray,
  IsEmail,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsArray()
  @IsPositive()
  rolsId: number[];

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  avatar: string | null;
}
