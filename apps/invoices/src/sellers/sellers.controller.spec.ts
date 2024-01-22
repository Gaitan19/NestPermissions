import { Test, TestingModule } from '@nestjs/testing';
import { SellersController } from './sellers.controller';
import { SellersService } from './sellers.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { Seller } from './entities/seller.entity';
import { BadRequestException } from '@nestjs/common';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { UpdateResult } from 'typeorm';

describe('SellersController', () => {
  let controller: SellersController;
  let service: SellersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellersController],
      providers: [
        {
          provide: SellersService,
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

    controller = module.get<SellersController>(SellersController);
    service = module.get<SellersService>(SellersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a seller', async () => {
      const createSellerDto: CreateSellerDto = {
        id: 1,
        name: 'John',
        lastName: 'Doe',
      };

      jest.spyOn(service, 'create').mockResolvedValueOnce({} as Seller);

      await controller.create(createSellerDto);

      expect(service.create).toHaveBeenCalledWith(createSellerDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of sellers', async () => {
      const sellers = [
        {
          id: 1,
          name: 'John',
          lastName: 'Doe',
          deletedAt: null,
          invoice: [],
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(sellers);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result.length).toBeGreaterThanOrEqual(0);
      expect(result).toEqual(sellers);
    });
  });

  describe('update', () => {
    it('should update a seller', async () => {
      const updateSellerDto: UpdateSellerDto = {
        name: 'UpdatedName',
        lastName: 'UpdatedLastName',
      };

      const updateResult: UpdateResult = new UpdateResult();

      jest.spyOn(service, 'update').mockResolvedValueOnce(updateResult);

      const result = await controller.update('1', updateSellerDto);

      expect(service.update).toHaveBeenCalledWith(1, updateSellerDto);
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove a seller', async () => {
      const updateResult: UpdateResult = new UpdateResult();
      updateResult.affected = 1;

      jest.spyOn(service, 'remove').mockResolvedValueOnce(updateResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(updateResult);
    });
  });

  describe('findOne', () => {
    it('should find a seller by id', async () => {
      const seller = {
        id: 1,
        name: 'John',
        lastName: 'Doe',
        deletedAt: null,
        invoice: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(seller);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(seller);
    });

    it('should handle not found seller', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new BadRequestException('Seller not found'));

      await expect(controller.findOne('99')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
