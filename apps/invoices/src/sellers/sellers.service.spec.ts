import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial, Repository, UpdateResult } from 'typeorm';
import { SellersService } from './sellers.service';
import { Seller } from './entities/seller.entity';
import { CreateSellerDto } from './dto/create-seller.dto';

describe('SellersService', () => {
  let service: SellersService;
  let sellersRepository: Repository<Seller>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SellersService,
        {
          provide: getRepositoryToken(Seller),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SellersService>(SellersService);
    sellersRepository = module.get<Repository<Seller>>(
      getRepositoryToken(Seller),
    );
  });

  describe('create', () => {
    it('should create a seller', async () => {
      const createSellerDto: CreateSellerDto = {
        id: 1,
        name: 'John',
        lastName: 'Doe',
      };

      jest
        .spyOn(sellersRepository, 'create')
        .mockImplementation((dto) => ({ ...dto }) as Seller);
      jest
        .spyOn(sellersRepository, 'save')
        .mockImplementation(async (seller) => {
          const requiredProperties: (keyof Seller)[] = [
            'id',
            'name',
            'lastName',
          ];
          const missingProperties = requiredProperties.filter(
            (prop) => !(prop in seller),
          );

          if (missingProperties.length > 0) {
            throw new Error(
              `Missing required properties: ${missingProperties.join(', ')}`,
            );
          }

          return seller as DeepPartial<Seller> & Seller;
        });

      const result = await service.create(createSellerDto);

      expect(sellersRepository.create).toHaveBeenCalledWith(createSellerDto);

      expect(sellersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(createSellerDto),
      );

      expect(result).toEqual(createSellerDto);
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

      jest.spyOn(sellersRepository, 'find').mockResolvedValueOnce(sellers);

      const result = await service.findAll();

      expect(sellersRepository.find).toHaveBeenCalled();
      expect(result.length).toBeGreaterThanOrEqual(0);
      expect(result).toEqual(sellers);
    });
  });

  describe('findOne', () => {
    it('should return a seller by id', async () => {
      const sellerId = 1;
      const seller = {
        id: 1,
        name: 'John',
        lastName: 'Doe',
        deletedAt: null,
        invoice: [],
      };

      jest.spyOn(sellersRepository, 'findOneBy').mockResolvedValueOnce(seller);

      const result = await service.findOne(sellerId);

      expect(sellerId).toBeGreaterThanOrEqual(1);
      expect(result).toEqual(seller);
    });
  });

  describe('update', () => {
    it('should update a seller', async () => {
      const updateSellerDto = {
        name: 'UpdatedName',
        lastName: 'UpdatedLastName',
      };

      const updateResult: UpdateResult = new UpdateResult();

      jest
        .spyOn(sellersRepository, 'update')
        .mockResolvedValueOnce(updateResult);

      const result = await service.update(1, updateSellerDto);

      expect(sellersRepository.update).toHaveBeenCalledWith(1, updateSellerDto);
      expect(result).toEqual(updateResult);
    });
  });

  describe('remove', () => {
    it('should remove a seller', async () => {
      const updateResult: UpdateResult = new UpdateResult();
      updateResult.affected = 1;

      jest
        .spyOn(sellersRepository, 'softDelete')
        .mockResolvedValueOnce(updateResult);

      const result = await service.remove(1);

      expect(sellersRepository.softDelete).toHaveBeenCalledWith(1);
      expect(result).toEqual(updateResult);
    });
  });
});
