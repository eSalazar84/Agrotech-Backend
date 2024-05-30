import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { Iinvoice } from './interface/invoice.entity';

describe('InvoiceService', () => {
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
      providers: [InvoiceService],
    })
      .overrideProvider(InvoiceService)
      .useValue(mockInvoiceRepository)
      .compile();

    invoiceService = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(invoiceService).toBeDefined();
  });

  describe('Testing over read method', () => {
    it('should be return all invoices', async () => {
      const invoiceSpy = mockInvoiceRepository.findAllInvoice()
      const invoiceReal = await invoiceService.findAllInvoice()
      expect(invoiceSpy).toEqual(invoiceReal);
    })

    it('should be return a one invoice', async () => {
      const oneInvoiceSpy = mockInvoiceRepository.findOneInvoice(mockedArrayInvoice[1].idInvoice)
      const oneInvoiceReal = await invoiceService.findOneInvoice(mockedArrayInvoice[1].idInvoice)
      expect(oneInvoiceReal).toEqual(oneInvoiceSpy);
    })
  })

});
