import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { InvoicesDetailsService } from '../invoices_details/invoices_details.service';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repository, DataSource } from 'typeorm';
import { InvoicesDetail } from '../invoices_details/entities/invoices_detail.entity';
import { User } from '../user/entities/user.entity';
import { IUser } from '../user/interface/user.interface';
import { Category, Rol } from '../helpers/enums-type.enum';

describe('InvoiceService', () => {
  let invoiceService: InvoiceService;
  let detailsService: InvoicesDetailsService;
  let userService: UserService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: getRepositoryToken(Invoice),
          useValue: Repository
        },
        InvoicesDetailsService,
        {
          provide: getRepositoryToken(InvoicesDetail),
          useValue: Repository
        },
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: Repository
        },
        {
          provide: DataSource,
          useValue: {
            manager: {
              transaction: jest.fn().mockImplementation((fn) => fn())
            }
          }

        }
      ],
    }).compile()

    invoiceService = module.get<InvoiceService>(InvoiceService);
    detailsService = module.get<InvoicesDetailsService>(InvoicesDetailsService)
    userService = module.get<UserService>(UserService)
  });

  it('should be defined', () => {
    expect(invoiceService).toBeDefined();
  });

  describe('Testing over create method', () => {
    it('should be create a new invoice', async () => {
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
      }

      const invoiceMock = {
        "invoiceDate": new Date("2024-05-21T23:20:50.000Z"),
        "total_without_iva": 21216,
        "total_with_iva": 25671,
        "idInvoice": 1
      }

      const detailsMock = {
        "id": 1,
        "amount_sold": 1
      }

      const productMock = [
        {
          "idProduct": 1,
          "codeProduct": "Rop-8a0",
          "product": "botas",
          "description": "para caminar",
          "price": 10520,
          "category": Category.Ropa_de_trabajo,
          "amount": 20,
          "images": "C:\\fakepath\\IMG-20240513-WA0024.jpg"
        }
      ]

      jest.spyOn(userService, 'findOneUser').mockResolvedValue(userMock);
      jest.spyOn(invoiceService, 'createInvoice').mockResolvedValue(invoiceMock as any);

      const result = await invoiceService.createInvoice(userMock.idUser, productMock);

      expect(result).toBeDefined()
    })
  })

  describe('findAllInvoice', () => {
    it('should return an array of invoices', async () => {
      const mockInvoices: Invoice[] = [];

      jest.spyOn(invoiceService, 'findAllInvoice').mockResolvedValue(mockInvoices);

      const invoices = await invoiceService.findAllInvoice();

      expect(invoices).toEqual(mockInvoices)
    });
  });

});
