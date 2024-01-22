import { IsString } from 'class-validator';

export class CreateSellerDto {
  id: number;
  @IsString()
  name: string;

  @IsString()
  lastName: string;
}
