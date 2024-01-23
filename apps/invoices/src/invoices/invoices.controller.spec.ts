import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './entities/invoice.entity';
import { BadRequestException } from '@nestjs/common';
import { InvoiceDetail } from '../invoice-details/entities/invoice-detail.entity';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let service: InvoicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: InvoicesService,
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

    controller = module.get<InvoicesController>(InvoicesController);
    service = module.get<InvoicesService>(InvoicesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      jest.spyOn(service, 'create').mockResolvedValueOnce({} as Invoice);

      await controller.create(createInvoiceDto);

      expect(service.create).toHaveBeenCalledWith(createInvoiceDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      const invoices = [
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
      ];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(invoices as any);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result.length).toBeGreaterThanOrEqual(0);
      expect(result).toEqual(invoices);
    });
  });

  describe('findOne', () => {
    it('should find an invoice by id', async () => {
      const id = 1;
      const invoice = {
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

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(invoice as any);

      const result = await controller.findOne(id);

      expect(id).toBeGreaterThanOrEqual(1);
      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(invoice);
    });

    it('should handle not found invoice', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new BadRequestException('Invoice not found'));

      await expect(controller.findOne(99)).rejects.toThrow(BadRequestException);
    });
  });
});
