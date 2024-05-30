import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { Invoice } from './entities/invoice.entity';
import { Iinvoice } from './interface/invoice.entity';
import { JwtService } from '@nestjs/jwt';

describe('InvoiceController', () => {
  let invoiceController: InvoiceController

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
    findOneInvoice: jest.fn((idInvoice: number) => mockedArrayInvoice.find(invoice => invoice.idInvoice === idInvoice)),
    removeInvoice: jest.fn((id: number) => {
      const invoiceIndex = mockedArrayInvoice.findIndex(invoice => invoice.idInvoice === id)
      if (invoiceIndex !== -1) {
        return mockedArrayInvoice.splice(invoiceIndex, 1)[0]
      } else {
        return null
      }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoiceController],
      providers: [InvoiceService, JwtService],
    })
      .overrideProvider(InvoiceService)
      .useValue(mockInvoiceRepository)
      .compile();

    invoiceController = module.get<InvoiceController>(InvoiceController);
  });

  it('should be defined', () => {
    expect(invoiceController).toBeDefined();
  });

  describe('Testing over read method', () => {
    it('should be return all invoices', async () => {
      const invoiceSpy = mockInvoiceRepository.findAllInvoice()
      const invoiceReal = await invoiceController.findAll()
      expect(invoiceReal).toEqual(invoiceSpy);
    })

    it('should return a one Details', async () => {
      const invoiceSpy = mockInvoiceRepository.findOneInvoice(mockedArrayInvoice[1].idInvoice)
      const invoiceReal = await invoiceController.findOne(mockedArrayInvoice[1].idInvoice)
      expect(invoiceReal).toBe(invoiceSpy)
    })
  })

  describe('Testing over delete method', () => {
    it('should return deleted invoice-detail', async () => {
      const invoiceToDelete = {
        "invoiceDate": new Date("2024-05-21T23:28:09.000Z"),
        "total_without_iva": 21216,
        "total_with_iva": 25671,
        "idInvoice": 4
      }
      const invoiceSpy = mockInvoiceRepository.removeInvoice(invoiceToDelete.idInvoice)
      const invoiceReal = await invoiceController.remove(invoiceToDelete.idInvoice)
      expect(invoiceSpy).toEqual(invoiceReal);
    })
  })
});
