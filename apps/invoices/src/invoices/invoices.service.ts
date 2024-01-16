import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Seller } from '../sellers/entities/seller.entity';
import { Customer } from '../customers/entities/customer.entity';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private invoicesRepository: Repository<Invoice>,
    @InjectRepository(Seller)
    private sellersRepository: Repository<Seller>,
    @InjectRepository(Customer)
    private customersRepository: Repository<Customer>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto) {
    const { sellerid, customerid, ...validDto } = createInvoiceDto;

    const seller = await this.sellersRepository.findOneBy({ id: sellerid });

    if (!seller) {
      throw new BadRequestException('Seller not found');
    }

    const customer = await this.customersRepository.findOneBy({
      id: customerid,
    });

    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    const invoice = this.invoicesRepository.create({
      ...validDto,
      seller,
      customer,
    });

    return await this.invoicesRepository.save(invoice);
  }

  findAll() {
    return this.invoicesRepository.find({
      relations: {
        seller: true,
        customer: true,
      },
    });
  }

  async findOne(id: number) {
    return await this.invoicesRepository.findOne({
      where: { id: id },
      relations: {
        seller: true,
        customer: true,
      },
    });
  }

  async update(id: number, updateInvoiceDto: UpdateInvoiceDto) {
    const { sellerid, customerid, ...validDto } = updateInvoiceDto;

    const invoice = await this.invoicesRepository.findOneBy({ id });

    if (!invoice) {
      throw new BadRequestException('Invoice not found');
    }

    let seller;
    if (sellerid) {
      seller = await this.sellersRepository.findOneBy({ id: sellerid });

      if (!seller) {
        throw new BadRequestException('Seller not found');
      }
    }

    let customer;
    if (customerid) {
      customer = await this.customersRepository.findOneBy({ id: customerid });

      if (!customer) {
        throw new BadRequestException('Customer not found');
      }
    }

    return await this.invoicesRepository.save({
      ...invoice,
      ...validDto,
      seller,
      customer,
    });
  }

  async remove(id: number) {
    return await this.invoicesRepository.softDelete(id);
  }
}
