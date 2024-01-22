/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer } from './entities/customer.entity';
import { BadRequestException } from '@nestjs/common';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        id: 1,
        name: 'John',
        lastName: 'Doe',
        address: 'rubenia',
        phone: 1234567890,
      };

      jest.spyOn(service, 'create').mockResolvedValueOnce({} as Customer);

      await controller.create(createCustomerDto);

      expect(service.create).toHaveBeenCalledWith(createCustomerDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      const customers = [
        {
          id: 1,
          name: 'John',
          lastName: 'Doe',
          address: 'rubenia',
          phone: 1234567890,
          deletedAt: null,
          invoice: [],
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(customers);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result.length).toBeGreaterThanOrEqual(0);
      expect(result).toEqual(customers);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const updateCustomerDto: UpdateCustomerDto = {
        name: 'kevin',
        lastName: 'gonzalez',
        address: 'man',
        phone: 9876543210,
      };

      const updateResult: UpdateResult = new UpdateResult();

      jest.spyOn(service, 'update').mockResolvedValueOnce(updateResult);

      const result = await controller.update('1', updateCustomerDto);

      expect(service.update).toHaveBeenCalledWith(1, updateCustomerDto);
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove a customer', async () => {
      const updateResult: UpdateResult = new UpdateResult();
      updateResult.affected = 1;

      jest.spyOn(service, 'remove').mockResolvedValueOnce(updateResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(updateResult);
    });
  });

  describe('findOne', () => {
    it('should find a customer by id', async () => {
      const customer = {
        id: 1,
        name: 'John',
        lastName: 'Doe',
        address: 'rubenia',
        phone: 1234567890,
        deletedAt: null,
        invoice: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(customer);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(customer);
    });

    it('should handle not found customer', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new BadRequestException('Customer not found'));

      await expect(controller.findOne('99')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
