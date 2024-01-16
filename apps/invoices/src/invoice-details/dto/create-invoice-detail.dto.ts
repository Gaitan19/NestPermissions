import { IsNumber, IsPositive } from 'class-validator';

export class CreateInvoiceDetailDto {
  @IsNumber()
  @IsPositive()
  productid: number;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  invoiceId: number;
}
