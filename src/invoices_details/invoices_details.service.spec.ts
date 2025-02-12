import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesDetailsService } from './invoices_details.service';
import { CreateInvoicesDetailDto } from './dto/create-invoices_detail.dto';

describe('InvoicesDetailsService', () => {
  let detailsService: InvoicesDetailsService;

  const mockArrayDetails = [
    {
      "id": 1,
      "amount_sold": 1
    },
    {
      "id": 2,
      "amount_sold": 3
    },
    {
      "id": 3,
      "amount_sold": 1
    },
    {
      "id": 4,
      "amount_sold": 3
    },
    {
      "id": 5,
      "amount_sold": 1
    },
    {
      "id": 6,
      "amount_sold": 3
    }
  ]

  const mockDetailsRepository = {
    findAllDetailsInv_Det: jest.fn(() => mockArrayDetails),
    findOneInv_Det: jest.fn((id: number) => mockArrayDetails.find(detail => detail.id === id)),
    updateInv_Det: jest.fn((id: number, updateDetails: CreateInvoicesDetailDto) => {
      const detailIndex = mockArrayDetails.findIndex(detail => detail.id === id);
      if (detailIndex !== -1) {
        mockArrayDetails[detailIndex] = { ...mockArrayDetails[detailIndex], ...updateDetails };
        return mockArrayDetails[detailIndex];
      } else {
        return null;
      }
    }),
    removeInv_Det: jest.fn((id: number) => {
      const detailIndex = mockArrayDetails.findIndex(detail => detail.id === id)
      if (detailIndex !== -1) {
        return mockArrayDetails.splice(detailIndex, 1)[0]
      } else {
        return null
      }
    })
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoicesDetailsService],
    })
      .overrideProvider(InvoicesDetailsService)
      .useValue(mockDetailsRepository)
      .compile();

    detailsService = module.get<InvoicesDetailsService>(InvoicesDetailsService);
  });

  it('should be defined', () => {
    expect(detailsService).toBeDefined();
  });

  describe('Testing over read method', () => {
    it('should return all details', async () => {
      const detailsSpy = mockDetailsRepository.findAllDetailsInv_Det()
      const detailsReal = await detailsService.findAllDetailsInv_Det()
      expect(detailsReal).toEqual(detailsSpy)
    })

    it('should return a one Details', async () => {
      const detailsSpy = mockDetailsRepository.findOneInv_Det(mockArrayDetails[1].id)
      const detailsReal = await detailsService.findOneInv_Det(mockArrayDetails[1].id)
      expect(detailsReal).toBe(detailsSpy)
    })
  })


})
