import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { InvoicesService } from './invoices.service';
import { Invoice } from './entities/invoice.entity';
import { Seller } from '../sellers/entities/seller.entity';
import { Customer } from '../customers/entities/customer.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InvoiceDetail } from '../invoice-details/entities/invoice-detail.entity';

describe('InvoicesService', () => {
  let service: InvoicesService;
  let invoicesRepository: Repository<Invoice>;
  let sellersRepository: Repository<Seller>;
  let customersRepository: Repository<Customer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoicesService,
        {
          provide: getRepositoryToken(Invoice),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Seller),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Customer),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    invoicesRepository = module.get<Repository<Invoice>>(
      getRepositoryToken(Invoice),
    );
    sellersRepository = module.get<Repository<Seller>>(
      getRepositoryToken(Seller),
    );
    customersRepository = module.get<Repository<Customer>>(
      getRepositoryToken(Customer),
    );
  });

  describe('create', () => {
    it('should create an invoice', async () => {
      const createInvoiceDto: CreateInvoiceDto = {
        id: 1,
        sellerid: 1,
        customerid: 1,
        date: new Date(),
        total: 100,
      };

      const seller: DeepPartial<Seller> = {
        id: 1,
        name: 'kevin',
        lastName: 'gonzales',
        deletedAt: null as Date,
        invoice: [] as Invoice[],
      };

      const customer: DeepPartial<Customer> = {
        id: 1,
        name: 'manolo',
        lastName: 'lopez',
        deletedAt: null as Date,
        invoice: [] as Invoice[],
      };

      const invoice: DeepPartial<Invoice> = {
        id: 1,
        date: new Date(),
        total: 100,
        seller,
        customer,
        deletedAt: null as Date,
        invoiceDetails: [] as InvoiceDetail[],
      };

      jest
        .spyOn(invoicesRepository, 'create')
        .mockImplementation((dto) => ({ ...dto }) as Invoice);

      jest
        .spyOn(sellersRepository, 'findOneBy')
        .mockResolvedValueOnce(seller as any);
      jest
        .spyOn(customersRepository, 'findOneBy')
        .mockResolvedValueOnce(customer as any);

      jest
        .spyOn(invoicesRepository, 'save')
        .mockResolvedValueOnce(invoice as any);

      const result = await service.create(createInvoiceDto);

      expect(invoicesRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          id: createInvoiceDto.id,
          date: createInvoiceDto.date,
          total: createInvoiceDto.total,
          seller,
          customer,
        }),
      );

      expect(invoicesRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: createInvoiceDto.id,
          date: createInvoiceDto.date,
          total: createInvoiceDto.total,
          seller,
          customer,
        }),
      );

      expect(result).toEqual(invoice);
    });
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      const invoices: DeepPartial<Invoice>[] = [
        {
          id: 1,
          date: new Date(),
          total: 100,
          seller: {
            id: 1,
            name: 'kevin',
            lastName: 'gonzales',
            deletedAt: null as Date,
            invoice: [] as Invoice[],
          },
          customer: {
            id: 1,
            name: 'manolo',
            lastName: 'lopez',
            deletedAt: null as Date,
            invoice: [] as Invoice[],
          },
          deletedAt: null as Date,
          invoiceDetails: [] as InvoiceDetail[],
        },
        // ... Puedes agregar más invoices según sea necesario
      ];

      jest
        .spyOn(invoicesRepository, 'find')
        .mockResolvedValueOnce(invoices as any);

      const result = await service.findAll();

      expect(invoicesRepository.find).toHaveBeenCalled();
      expect(result.length).toBeGreaterThanOrEqual(0);
      expect(result).toEqual(invoices);
    });
  });

  it('should find an invoice by id', async () => {
    const id = 1;
    const invoice: DeepPartial<Invoice> = {
      id: 1,
      date: new Date(),
      total: 100,
      seller: {
        id: 1,
        name: 'kevin',
        lastName: 'gonzales',
        deletedAt: null as Date,
        invoice: [] as Invoice[],
      },
      customer: {
        id: 1,
        name: 'manolo',
        lastName: 'lopez',
        deletedAt: null as Date,
        invoice: [] as Invoice[],
      },
      deletedAt: null as Date,
      invoiceDetails: [] as InvoiceDetail[],
    };

    jest
      .spyOn(invoicesRepository, 'findOne')
      .mockResolvedValueOnce(invoice as any);

    const result = await service.findOne(id);

    expect(invoicesRepository.findOne).toHaveBeenCalledWith({
      relations: {
        customer: true,
        seller: true,
      },
      where: {
        id: 1,
      },
    });

    expect(id).toBeGreaterThanOrEqual(1);
    expect(result).toEqual(invoice);
  });

  describe('remove', () => {
    it('should remove an invoice by id', async () => {
      const id = 1;

      jest
        .spyOn(invoicesRepository, 'softDelete')
        .mockResolvedValueOnce({ affected: 1 } as any);

      const result = await service.remove(id);

      expect(invoicesRepository.softDelete).toHaveBeenCalledWith(id);
      expect(result).toEqual({ affected: 1 });
    });
  });
});
