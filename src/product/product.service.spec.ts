import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductService],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  /* it('should be return a correct email', async () => {
    const userEmail = 'fabricio@gmail.com';
    const userEmailSpy = mockUserRepository.findUserByEmail(userEmail)
    const userEmailReal = await userService.findUserByEmail(userEmail);
    expect(userEmailReal).toEqual(userEmailSpy);
  }); */
});
