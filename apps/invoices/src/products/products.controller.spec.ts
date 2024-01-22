import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { BadRequestException } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateResult } from 'typeorm';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
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

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        id: 1,
        name: 'destornillador',
        description: 'ranura',
        unitofmeasure: 'idk',
        price: 50,
        stock: 100,
      };

      jest.spyOn(service, 'create').mockResolvedValueOnce({} as Product);

      await controller.create(createProductDto);

      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products = [
        {
          id: 1,
          name: 'destornillador',
          description: 'estrella',
          unitofmeasure: 'idk',
          price: 50,
          stock: 100,
          deletedAt: null,
          invoiceDetails: [],
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(products);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result.length).toBeGreaterThanOrEqual(0);
      expect(result).toEqual(products);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        name: 'martillo',
        description: 'acero',
        unitofmeasure: 'idk',
        price: 75,
        stock: 50,
      };

      const updateResult: UpdateResult = new UpdateResult();

      jest.spyOn(service, 'update').mockResolvedValueOnce(updateResult);

      const result = await controller.update('1', updateProductDto);

      expect(service.update).toHaveBeenCalledWith(1, updateProductDto);
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const updateResult: UpdateResult = new UpdateResult();
      updateResult.affected = 1;

      jest.spyOn(service, 'remove').mockResolvedValueOnce(updateResult);

      const result = await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
      expect(result).toEqual(updateResult);
    });
  });

  describe('findOne', () => {
    it('should find a product by id', async () => {
      const product = {
        id: 1,
        name: 'martillo',
        description: 'acero',
        unitofmeasure: 'idk',
        price: 50,
        stock: 100,
        deletedAt: null,
        invoiceDetails: [],
      };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(product);

      const result = await controller.findOne('1');

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(product);
    });

    it('should handle not found product', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new BadRequestException('Product not found'));

      await expect(controller.findOne('99')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
