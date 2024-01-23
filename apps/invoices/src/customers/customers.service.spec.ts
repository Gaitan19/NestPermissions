import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial, Repository, UpdateResult } from 'typeorm';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';

describe('CustomersService', () => {
  let service: CustomersService;
  let customersRepository: Repository<Customer>;

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
    customersRepository = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
  });
  describe('create', () => {
    it('should create a customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        id: 1,
        name: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        phone: 1234567890,
      };

      jest
        .spyOn(customersRepository, 'create')
        .mockImplementation((dto) => ({ ...dto }) as Customer);
      jest
        .spyOn(customersRepository, 'save')
        .mockImplementation(async (customer) => {
          const requiredProperties: (keyof Customer)[] = [
            'id',
            'name',
            'lastName',
            'address',
            'phone',
          ];
          const missingProperties = requiredProperties.filter(
            (prop) => !(prop in customer),
          );

          if (missingProperties.length > 0) {
            throw new Error(
              `Missing required properties: ${missingProperties.join(', ')}`,
            );
          }

          return customer as DeepPartial<Customer> & Customer;
        });

      const result = await service.create(createCustomerDto);

      expect(customersRepository.create).toHaveBeenCalledWith(
        createCustomerDto,
      );

      expect(customersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(createCustomerDto),
      );

      expect(result).toEqual(createCustomerDto);
      
    });
  });

  describe('findOne', () => {
    it('should return a customer by id', async () => {
      const customerId = 1;
      const customer = {
        id: 1,
        name: 'John',
        lastName: 'Doe',
        address: '123 Main St',
        phone: 1234567890,
        deletedAt: null,
        invoice: [],
      };

      jest
        .spyOn(customersRepository, 'findOneBy')
        .mockResolvedValueOnce(customer);

      const result = await service.findOne(customerId);
      console.log('result :>> ', result);
      expect(customerId).toBeGreaterThanOrEqual(1);
      expect(result).toEqual(customer);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const updateCustomerDto = {
        name: 'UpdatedName',
        lastName: 'UpdatedLastName',
        address: 'UpdatedAddress',
        phone: 9876543210,
      };

      const updateResult: UpdateResult = new UpdateResult();

      jest
        .spyOn(customersRepository, 'update')
        .mockResolvedValueOnce(updateResult);

      const result = await service.update(1, updateCustomerDto);

      expect(customersRepository.update).toHaveBeenCalledWith(
        1,
        updateCustomerDto,
      );
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove a customer', async () => {
      const updateResult: UpdateResult = new UpdateResult();
      updateResult.affected = 1;

      jest
        .spyOn(customersRepository, 'softDelete')
        .mockResolvedValueOnce(updateResult);

      const result = await service.remove(1);

      expect(customersRepository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual(updateResult);
    });
  });
});
