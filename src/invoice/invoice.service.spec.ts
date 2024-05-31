import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { Iinvoice } from './interface/invoice.entity';
import { InvoicesDetailsService } from '../invoices_details/invoices_details.service';
import { UserService } from '../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { Repository, DataSource } from 'typeorm';
import { InvoicesDetail } from '../invoices_details/entities/invoices_detail.entity';
import { User } from '../user/entities/user.entity';
import { IUser } from '../user/interface/user.interface';
import { Rol } from '../helpers/enums-type.enum';

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


      jest.spyOn(userService, 'findOneUser').mockResolvedValue(userMock)
      jest.spyOn(invoiceService, 'createInvoice').mockRejectedValue(invoiceMock)

      

      
      




    })
  })


});
