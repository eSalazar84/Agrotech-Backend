import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { User } from '../user/entities/user.entity';
import { InvoicesDetail } from '../invoices_details/entities/invoices_detail.entity';
import { Product } from '../product/entities/product.entity';
import { DataSource, QueryRunner } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { IUser } from '../user/interface/user.interface';
import { IProduct } from '../product/interface/product.interface';
import { Category, Rol } from '../helpers/enums-type.enum';

const mockInvoiceRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

const mockUserRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockInvoicesDetailRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockProductRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  remove: jest.fn(),
};

const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    findOne: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  },
};

const mockDataSource = {
  createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
};

const mockMailService = {
  sendPurchaseConfirmationEmail: jest.fn(),
};

describe('InvoiceService', () => {
  let invoiceService: InvoiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getRepositoryToken(Invoice),
          useValue: mockInvoiceRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(InvoicesDetail),
          useValue: mockInvoicesDetailRepository,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
      ],
    }).compile();

    invoiceService = module.get<InvoiceService>(InvoiceService);
  });

  it('should be defined', () => {
    expect(invoiceService).toBeDefined();
  });

  it('should return all invoices', async () => {
    const invoices = [{ id: 1, amount: 100 }];
    mockInvoiceRepository.find.mockResolvedValue(invoices);

    const result = await invoiceService.findAllInvoice();
    expect(result).toEqual(invoices);
  });

  describe('createInvoice', () => {
    it('should create a new invoice', async () => {
      const userMock: IUser = {
        idUser: 1,
        name: 'Anabel',
        lastname: 'Assann',
        email: 'anabel@gmail.com',
        phone: '2281513051',
        birthDate: new Date('1984-05-13T13:54:00.000Z'),
        createdAt: new Date('2024-03-18T13:54:00.000Z'),
        active: true,
        rol: Rol.USER,
        address: "calle falsa 123"
      };

      const invoiceMock: CreateInvoiceDto = {
        invoiceDate: new Date("2024-05-21T23:20:50.000Z"),
        total_without_iva: 21216,
        total_with_iva: 25671,
        id_user: userMock.idUser,
      };

      const productMock: IProduct[] = [
        {
          idProduct: 1,
          codeProduct: "Rop-8a0",
          product: "botas",
          description: "para caminar",
          price: 10520,
          category: Category.Ropa_de_trabajo,
          amount: 20,
          images: "C:\\fakepath\\IMG-20240513-WA0024.jpg",
          active: true
        }
      ];

      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(userMock);
      jest.spyOn(mockQueryRunner.manager, 'save').mockResolvedValue(invoiceMock as any);
      jest.spyOn(mockQueryRunner.manager, 'findOne').mockResolvedValue(productMock[0]);

      const result = await invoiceService.createInvoice(userMock.idUser, productMock);

      expect(result).toEqual(invoiceMock);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { idUser: userMock.idUser } });
      expect(mockQueryRunner.manager.save).toHaveBeenCalled();
      expect(mockMailService.sendPurchaseConfirmationEmail).toHaveBeenCalled();
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(null);

      await expect(invoiceService.createInvoice(999, [])).rejects.toThrow(HttpException);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { idUser: 999 } });
    });

    it('should throw an error if product stock is insufficient', async () => {
      const userMock: IUser = {
        idUser: 1,
        name: 'Anabel',
        lastname: 'Assann',
        email: 'anabel@gmail.com',
        phone: '2281513051',
        birthDate: new Date('1984-05-13T13:54:00.000Z'),
        createdAt: new Date('2024-03-18T13:54:00.000Z'),
        active: true,
        rol: Rol.USER,
        address: "calle falsa 123"
      };

      const productMock: IProduct[] = [
        {
          idProduct: 1,
          codeProduct: "Rop-8a0",
          product: "botas",
          description: "para caminar",
          price: 10520,
          category: Category.Ropa_de_trabajo,
          amount: 20,
          images: "C:\\fakepath\\IMG-20240513-WA0024.jpg",
          active: true
        }
      ];

      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(userMock);
      jest.spyOn(mockQueryRunner.manager, 'findOne').mockResolvedValue({
        ...productMock[0],
        amount: 0 // Insufficient stock
      });

      await expect(invoiceService.createInvoice(userMock.idUser, productMock)).rejects.toThrow(HttpException);
      expect(mockQueryRunner.manager.findOne).toHaveBeenCalled();
    });

    it('should rollback transaction if error occurs', async () => {
      const userMock: IUser = {
        idUser: 1,
        name: 'Anabel',
        lastname: 'Assann',
        email: 'anabel@gmail.com',
        phone: '2281513051',
        birthDate: new Date('1984-05-13T13:54:00.000Z'),
        createdAt: new Date('2024-03-18T13:54:00.000Z'),
        active: true,
        rol: Rol.USER,
        address: "calle falsa 123"
      };

      const productMock: IProduct[] = [
        {
          idProduct: 1,
          codeProduct: "Rop-8a0",
          product: "botas",
          description: "para caminar",
          price: 10520,
          category: Category.Ropa_de_trabajo,
          amount: 20,
          images: "C:\\fakepath\\IMG-20240513-WA0024.jpg",
          active: true
        }
      ];

      jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(userMock);
      jest.spyOn(mockQueryRunner.manager, 'findOne').mockResolvedValue(productMock[0]);
      jest.spyOn(mockQueryRunner.manager, 'save').mockRejectedValue(new Error('Database error'));

      await expect(invoiceService.createInvoice(userMock.idUser, productMock)).rejects.toThrow(HttpException);
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });

  describe('InvoiceService', () => {
    let invoiceService: InvoiceService;
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          InvoiceService,
          {
            provide: getRepositoryToken(Invoice),
            useValue: mockInvoiceRepository,
          },
          {
            provide: getRepositoryToken(User),
            useValue: mockUserRepository,
          },
          {
            provide: getRepositoryToken(InvoicesDetail),
            useValue: mockInvoicesDetailRepository,
          },
          {
            provide: getRepositoryToken(Product),
            useValue: mockProductRepository,
          },
          {
            provide: DataSource,
            useValue: mockDataSource,
          },
          {
            provide: MailService,
            useValue: mockMailService,
          },
        ],
      }).compile();
  
      invoiceService = module.get<InvoiceService>(InvoiceService);
    });
  
    it('should be defined', () => {
      expect(invoiceService).toBeDefined();
    });
  
    it('should return all invoices', async () => {
      const invoices = [{ id: 1, amount: 100 }];
      mockInvoiceRepository.find.mockResolvedValue(invoices);
  
      const result = await invoiceService.findAllInvoice();
      expect(result).toEqual(invoices);
    });
  
    describe('findOneInvoice', () => {
      it('should return an invoice', async () => {
        const invoice = { idInvoice: 1, total: 100, user: {}, invoiceDetails: [] };
        mockInvoiceRepository.findOne.mockResolvedValue(invoice);
  
        const result = await invoiceService.findOneInvoice(1);
        expect(result).toEqual(invoice);
      });
  
      it('should throw an error if invoice not found', async () => {
        mockInvoiceRepository.findOne.mockResolvedValue(null);
  
        await expect(invoiceService.findOneInvoice(999)).rejects.toThrow(HttpException);
        expect(mockInvoiceRepository.findOne).toHaveBeenCalledWith({
          where: { idInvoice: 999 },
          relations: ['user', 'invoiceDetails', 'invoiceDetails.product'],
        });
      });
    });
  
    describe('findInvoiceByUser', () => {
      it('should return invoices for a user', async () => {
        const invoices = [{ idInvoice: 1, total: 100, user: { idUser: 1 }, invoiceDetails: [] }];
        mockInvoiceRepository.find.mockResolvedValue(invoices);
  
        const result = await invoiceService.findInvoiceByUser(1);
        expect(result).toEqual(invoices);
      });
  
      it('should throw an error if no invoices found for user', async () => {
        mockInvoiceRepository.find.mockResolvedValue([]);
  
        await expect(invoiceService.findInvoiceByUser(999)).rejects.toThrow(HttpException);
        expect(mockInvoiceRepository.find).toHaveBeenCalledWith({
          where: { user: { idUser: 999 } },
          relations: ['user', 'invoiceDetails', 'invoiceDetails.product'],
        });
      });
    });
  
    describe('removeInvoice', () => {
      /* it('should remove an invoice successfully', async () => {
        const invoice = {
          idInvoice: 5,
          invoiceDetails: [{ amount_sold: 10, product: { idProduct: 1, amount: 10 } }],
        };
  
        jest.spyOn(mockQueryRunner.manager, 'findOne').mockResolvedValueOnce(invoice);
        jest.spyOn(mockQueryRunner.manager, 'findOne').mockResolvedValueOnce(invoice.invoiceDetails[0].product);
  
        const result = await invoiceService.removeInvoice(1);
  
        expect(result).toEqual({ message: 'Invoice deleted successfully', statusCode: HttpStatus.OK });
        expect(mockQueryRunner.manager.delete).toHaveBeenCalledTimes(2);
        expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      }); */
  
      it('should throw an error if invoice not found', async () => {
        jest.spyOn(mockQueryRunner.manager, 'findOne').mockResolvedValue(null);
  
        await expect(invoiceService.removeInvoice(999)).rejects.toThrow(HttpException);
        expect(mockQueryRunner.manager.findOne).toHaveBeenCalledWith(Invoice, {
          where: { idInvoice: 999 },
          relations: ['invoiceDetails', 'invoiceDetails.product'],
        });
      });
  
      it('should rollback transaction if error occurs during removal', async () => {
        const invoice = {
          idInvoice: 1,
          invoiceDetails: [{ amount_sold: 10, product: { idProduct: 1, amount: 10 } }],
        };
  
        jest.spyOn(mockQueryRunner.manager, 'findOne').mockResolvedValue(invoice);
        jest.spyOn(mockQueryRunner.manager, 'delete').mockRejectedValue(new Error('Database error'));
  
        await expect(invoiceService.removeInvoice(1)).rejects.toThrow(HttpException);
        expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      });
    });
  });
  
});
