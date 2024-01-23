import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { ProductsService } from './products.service';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { BadRequestException } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';

describe('ProductsService', () => {
  let service: ProductsService;
  let productsRepository: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productsRepository = module.get<Repository<Product>>(
      getRepositoryToken(Product),
    );
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        id: 1,
        name: 'Product',
        description: 'Product description',
        unitofmeasure: 'unit',
        price: 10.99,
        stock: 100,
      };

      jest
        .spyOn(productsRepository, 'create')
        .mockReturnValueOnce(createProductDto as Product);
      jest
        .spyOn(productsRepository, 'save')
        .mockResolvedValueOnce(createProductDto as Product);

      const result = await service.create(createProductDto);

      expect(productsRepository.create).toHaveBeenCalledWith(createProductDto);
      expect(productsRepository.save).toHaveBeenCalledWith(
        createProductDto as Product,
      );

      expect(result).toEqual(expect.any(Object));
      expect(createProductDto.price).toBeGreaterThan(0);
      expect(result).toEqual(createProductDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const products: Product[] = [
        {
          id: 1,
          name: 'destonillador',
          description: 'estrella',
          unitofmeasure: 'idk',
          price: 15.99,
          stock: 50,
          deletedAt: null,
          invoiceDetails: [],
        },
        {
          id: 2,
          name: 'martillo',
          description: 'acero',
          unitofmeasure: 'kg',
          price: 25.99,
          stock: 30,
          deletedAt: null,
          invoiceDetails: [],
        },
      ];

      jest.spyOn(productsRepository, 'find').mockResolvedValueOnce(products);

      const result = await service.findAll();

      expect(result).toEqual(expect.any(Array));
      expect(productsRepository.find).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should throw BadRequestException if product not found', async () => {
      jest.spyOn(productsRepository, 'findOneBy').mockResolvedValueOnce(null);

      await expect(service.findOne(1)).rejects.toThrow(BadRequestException);
      expect(productsRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return a product by id', async () => {
      const product: Product = {
        id: 1,
        name: 'destonillador',
        description: 'acero',
        unitofmeasure: 'unit',
        price: 10.99,
        stock: 100,
        deletedAt: null,
        invoiceDetails: [],
      };

      jest
        .spyOn(productsRepository, 'findOneBy')
        .mockResolvedValueOnce(product);

      const result = await service.findOne(1);

      expect(result).toEqual(expect.any(Object));
      expect(productsRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result).toEqual(product);
    });
  });

  describe('update', () => {
    const updateResult: UpdateResult = new UpdateResult();

    it('should update a product', async () => {
      jest
        .spyOn(productsRepository, 'update')
        .mockResolvedValueOnce(updateResult);

      const updateProductDto: UpdateProductDto = {
        name: 'destornillador',
        description: 'estrella',
        unitofmeasure: 'idk',
        price: 15.99,
        stock: 50,
      };

      const result = await service.update(1, updateProductDto);

      expect(productsRepository.update).toHaveBeenCalledWith(
        1,
        updateProductDto,
      );
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const updateResult: UpdateResult = new UpdateResult();
      updateResult.affected = 1;
      jest
        .spyOn(productsRepository, 'softDelete')
        .mockResolvedValueOnce(updateResult);

      const result = await service.remove(1);

      expect(productsRepository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual(updateResult);
    });
  });
});
