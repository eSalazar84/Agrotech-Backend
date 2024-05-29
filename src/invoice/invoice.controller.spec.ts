import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { Invoice } from './entities/invoice.entity';
import { Iinvoice } from './interface/invoice.entity';

describe('InvoiceController', () => {
  let invoiceController: InvoiceController;
  let invoiceService: InvoiceService;

  const mockedArrayInvoice: Iinvoice[] = [
    {
      "invoiceDate": new Date("2024-05-21T23:20:50.000Z"),
      "total_without_iva": 21216,
      "total_with_iva": 25671,
      "idInvoice": 1
    },
    {
      "invoiceDate": new Date("2024-05-21T23:27:51.000Z"),
      "total_without_iva": 21216,
      "total_with_iva": 25671,
      "idInvoice": 2
    },
    {
      "invoiceDate": new Date("2024-05-21T23:28:09.000Z"),
      "total_without_iva": 21216,
      "total_with_iva": 25671,
      "idInvoice": 3
    }
  ]

  const mockInvoiceRepository = {
    createInvoice: jest.fn((newInvoice: Invoice) => {
      mockedArrayInvoice.push(newInvoice)
      return newInvoice;
    }),
    findAllInvoice: jest.fn(() => mockedArrayInvoice),
    findOneInvoice: jest.fn((idInvoive: number))
      findInvoiceByUser:
      removeInvoice
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [InvoiceService],
    }).compile();

    invoiceController = module.get<InvoiceController>(InvoiceController);
    invoiceService = module.get<InvoiceService>(InvoiceService)
  });

  it('should be defined', () => {
    expect(invoiceService).toBeDefined();
  });
});
