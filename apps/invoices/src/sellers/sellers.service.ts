import { Injectable } from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from './entities/seller.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SellersService {
  constructor(
    @InjectRepository(Seller)
    private sellersRepository: Repository<Seller>,
  ) {}

  async create(CreateSellerDto: CreateSellerDto) {
    const seller = this.sellersRepository.create(CreateSellerDto);

    return await this.sellersRepository.save(seller);
  }

  async findAll() {
    return await this.sellersRepository.find();
  }

  async findOne(id: number) {
    return await this.sellersRepository.findOneBy({ id });
  }

  async update(id: number, updateCustomerDto: UpdateSellerDto) {
    return await this.sellersRepository.update(id, updateCustomerDto);
  }

  async remove(id: number) {
    return await this.sellersRepository.softDelete(id);
  }
}
