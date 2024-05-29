import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesDetailsController } from './invoices_details.controller';
import { InvoicesDetailsService } from './invoices_details.service';
import { CreateInvoicesDetailDto } from './dto/create-invoices_detail.dto';

describe('InvoicesDetailsController', () => {
  let detailsController: InvoicesDetailsController;

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
      controllers: [InvoicesDetailsController],
      providers: [InvoicesDetailsService],
    })
      .overrideProvider(InvoicesDetailsService)
      .useValue(mockDetailsRepository)
      .compile();

    detailsController = module.get<InvoicesDetailsController>(InvoicesDetailsController)
  });

  it('should be defined', () => {
    expect(detailsController).toBeDefined();
  });

  describe('Testing over all Invoices Details', () => {
    it('should return all details', async () => {
      const detailsSpy = mockDetailsRepository.findAllDetailsInv_Det()
      const detailsReal = await detailsController.findAll()
      expect(detailsReal).toEqual(detailsSpy)
    })
  })

  describe('Testing over a invoice_details by id', () => {
    it('should return a one Details', async () => {
      const detailsSpy = mockDetailsRepository.findOneInv_Det(mockArrayDetails[1].id)
      const detailsReal = await detailsController.findOne(mockArrayDetails[1].id)
      expect(detailsReal).toBe(detailsSpy)
    })
  })

  describe('Testing over update method', () => {
    it('should return a updated Details', async () => {
      const detailsToUpdate = {
        id: 2,
        amount_sold: 5,
        id_product: 1,
        id_invoice: 2
      }
      const detailsSpy = mockDetailsRepository.updateInv_Det(detailsToUpdate.id, detailsToUpdate)
      const detailsReal = await detailsController.update(detailsToUpdate.id, detailsToUpdate)
      expect(detailsReal).toEqual(detailsSpy)
    }
    )
  })

  describe('Testing over delete method', () => {
    it('should return deleted invoice-detail', async () => {
      const detailsToDelete = {
        id: 7,
        amount_sold: 5,
        id_product: 1,
        id_invoice: 2
      }
      const detailsSpy = mockDetailsRepository.removeInv_Det(detailsToDelete.id)
      const detailsReal = await detailsController.remove(detailsToDelete.id)
      expect(detailsSpy).toEqual(detailsReal);
    })
  })
});
