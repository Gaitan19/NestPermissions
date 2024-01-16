import { IsArray, IsPositive, IsString } from 'class-validator';

export class CreatePermissionDto {
  @IsArray()
  @IsString()
  endpoints: string[];

  @IsArray()
  @IsPositive()
  rolsId: number[];

  @IsArray()
  @IsString()
  method: string[];
}
