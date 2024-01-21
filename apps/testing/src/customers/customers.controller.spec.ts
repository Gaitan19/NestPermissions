import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { NotFoundException } from '@nestjs/common';

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useClass: Repository,
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const createCustomerDto = {
        name: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        phone: '123456789',
      };

      const result = new Customer();
      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(createCustomerDto)).toBe(result);
    });
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      const customers = [new Customer(), new Customer()];
      jest.spyOn(service, 'findAll').mockResolvedValue(customers);

      expect(await controller.findAll()).toBe(customers);
    });
  });

  describe('findOne', () => {
    it('should return a customer by ID', async () => {
      const customer = new Customer();
      jest.spyOn(service, 'findOne').mockResolvedValue(customer);

      expect(await controller.findOne('1')).toBe(customer);
    });

    it('should throw NotFoundException if customer not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const updateCustomerDto = { name: 'UpdatedName' };
      const result = new Customer();
      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update('1', updateCustomerDto)).toBe(result);
    });

    it('should throw NotFoundException if customer not found', async () => {
      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update('1', {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a customer', async () => {
      const result = { affected: 1 };
      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove('1')).toBe(result);
    });

    it('should throw NotFoundException if customer not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
