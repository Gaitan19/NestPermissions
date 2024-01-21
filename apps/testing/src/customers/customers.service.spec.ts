import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';

describe('CustomersService', () => {
  let service: CustomersService;
  let repository: Repository<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getRepositoryToken(Customer),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    repository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const createCustomerDto = {
        name: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        phone: '123456789',
      };

      const customer = new Customer();
      jest.spyOn(repository, 'create').mockReturnValue(customer);
      jest.spyOn(repository, 'save').mockResolvedValue(customer);

      const result = await service.create(createCustomerDto);

      expect(repository.create).toHaveBeenCalledWith(createCustomerDto);
      expect(repository.save).toHaveBeenCalledWith(customer);
      expect(result).toEqual(customer);
    });
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      const customers = [new Customer(), new Customer()];
      jest.spyOn(repository, 'find').mockResolvedValue(customers);

      const result = await service.findAll();

      expect(result).toEqual(customers);
    });
  });

  describe('findOne', () => {
    it('should return a customer by ID', async () => {
      const customer = new Customer();
      jest.spyOn(repository, 'findOne').mockResolvedValue(customer);

      const result = await service.findOne(1);

      expect(result).toEqual(customer);
    });

    it('should throw NotFoundException if customer not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(undefined);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const updateCustomerDto = {
        name: 'UpdatedName',
      };
      const existingCustomer = new Customer();
      jest.spyOn(service, 'findOne').mockResolvedValue(existingCustomer);
      jest.spyOn(repository, 'save').mockResolvedValue(existingCustomer);

      const result = await service.update(1, updateCustomerDto);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repository.save).toHaveBeenCalledWith(
        Object.assign(existingCustomer, updateCustomerDto),
      );
      expect(result).toEqual(existingCustomer);
    });

    it('should throw NotFoundException if customer not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.update(1, {} as any)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a customer', async () => {
      const existingCustomer = new Customer();
      jest.spyOn(service, 'findOne').mockResolvedValue(existingCustomer);
      jest.spyOn(repository, 'softDelete').mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(repository.softDelete).toHaveBeenCalledWith(existingCustomer);
      expect(result).toEqual({ affected: 1 });
    });

    it('should throw NotFoundException if customer not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
