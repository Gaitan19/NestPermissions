import { IsArray, IsPositive, IsString } from 'class-validator';

export class CreatePermissionDto {
    @IsArray()
    @IsPositive()
    rolsId: number[];

    @IsString()
    method: string;
}
