import { Module } from '@nestjs/common';
import { InvoiceDetailsService } from './invoice-details.service';
import { InvoiceDetailsController } from './invoice-details.controller';
import { InvoiceDetail } from './entities/invoice-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesModule } from '../invoices/invoices.module';
import { ProductsModule } from '../products/products.module';
import { SellersModule } from '../sellers/sellers.module';
import { CustomersModule } from '../customers/customers.module';
import { InvoicesService } from '../invoices/invoices.service';
import { ProductsService } from '../products/products.service';
import { SellersService } from '../sellers/sellers.service';
import { CustomersService } from '../customers/customers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoiceDetail]),
    InvoicesModule,
    ProductsModule,
    SellersModule,
    CustomersModule,
  ],
  controllers: [InvoiceDetailsController],
  providers: [
    InvoiceDetailsService,
    InvoicesService,
    ProductsService,
    SellersService,
    CustomersService,
  ],
})
export class InvoiceDetailsModule {}
