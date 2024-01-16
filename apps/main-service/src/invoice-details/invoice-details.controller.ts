import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { InvoiceDetailsService } from './invoice-details.service';
import { CreateInvoiceDetailDto } from './dto/create-invoice-detail.dto';
import { UpdateInvoiceDetailDto } from './dto/update-invoice-detail.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('invoice-details')
export class InvoiceDetailsController {
  constructor(private readonly invoiceDetailsService: InvoiceDetailsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createInvoiceDetailDto: CreateInvoiceDetailDto) {
    return this.invoiceDetailsService.create(createInvoiceDetailDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  findAll() {
    return this.invoiceDetailsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string) {
    return this.invoiceDetailsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDetailDto: UpdateInvoiceDetailDto,
  ) {
    return this.invoiceDetailsService.update(+id, updateInvoiceDetailDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.invoiceDetailsService.remove(+id);
  }
}
