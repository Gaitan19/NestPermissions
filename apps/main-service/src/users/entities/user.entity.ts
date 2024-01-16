import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  @IsPositive()
  rolId: number;

  @IsString()
  email: string;

  @IsString()
  password: string;
}
