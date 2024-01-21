import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TestingService } from './testing.service';
import { CustomersModule } from './customers/customers.module';

@Module({
  imports: [CustomersModule],
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
