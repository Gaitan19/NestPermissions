import { IsDateString, IsNumber, IsPositive } from 'class-validator';

export class CreateInvoiceDto {
  id: number;
  @IsNumber()
  @IsPositive()
  sellerid: number;

  @IsNumber()
  @IsPositive()
  customerid: number;

  @IsDateString({ strict: true } as any)
  date: Date;

  @IsNumber()
  @IsPositive()
  total: number;
}
