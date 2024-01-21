import { IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateCustomerDto {
  id: number;
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  address: string;

  @IsNumber()
  @IsPositive()
  phone: number;
}
