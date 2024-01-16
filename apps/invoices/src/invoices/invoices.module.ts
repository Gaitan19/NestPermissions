import { Module } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { SellersModule } from '../sellers/sellers.module';
import { CustomersModule } from '../customers/customers.module';
import { SellersService } from '../sellers/sellers.service';
import { CustomersService } from '../customers/customers.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),

    SellersModule,
    CustomersModule,
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService, SellersService, CustomersService],
  exports: [TypeOrmModule],
})
export class InvoicesModule {}
