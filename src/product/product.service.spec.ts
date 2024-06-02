import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../helpers/enums-type.enum';

describe('ProductService', () => {
  let productService: ProductService;

  const mockProductRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findByCategory: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    create: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: mockProductRepository
        }
      ],
    }).compile();

    productService = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(productService).toBeDefined();
  });

  describe('createProduct', () => {
    it('should create a new product', async () => {
      const productDto = {
        price: 100,
        category: Category.Ferreteria,
        idProduct: 1,
        description: 'test de product',
        amount: 5,
        product: 'test on products',
        images: 'fake images'
      };
      const createdProduct = { id: 1, ...productDto };

      mockProductRepository.create.mockReturnValue(createdProduct); 
      mockProductRepository.save.mockResolvedValue(createdProduct);

      const result = await productService.createProduct(productDto);

      expect(result).toEqual(createdProduct);
      expect(mockProductRepository.create).toHaveBeenCalledWith(productDto); 
      expect(mockProductRepository.save).toHaveBeenCalledWith(createdProduct);
    });
  })

  describe('Testing over patch method', () => {
    it('should update a Product by id', async () => {
      const productDto = {
        price: 100,
        category: Category.Ferreteria,
        idProduct: 1,
        description: 'test de product',
        amount: 5,
        product: 'test on products',
        images: 'fake images'
      };
      const productFound = { idProduct: 1, ...productDto };

      mockProductRepository.findOne.mockResolvedValue(productFound);
      mockProductRepository.save.mockResolvedValue({ ...productFound, ...productDto });

      const productReal = await productService.updateProduct(productDto.idProduct, productDto);

      expect(productReal).toEqual({ ...productFound, ...productDto });
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { idProduct: productDto.idProduct } });
      expect(mockProductRepository.save).toHaveBeenCalledWith({ ...productFound, ...productDto });
    });
  });

  describe('findAll and findOne', () => {
    it('should return all products', async () => {
      const products = [{
        price: 100,
        category: Category.Ferreteria,
        idProduct: 1,
        description: 'test de product',
        amount: 5,
        product: 'test on products',
        images: 'fake images'
      }];
      mockProductRepository.find.mockResolvedValue(products);

      const result = await productService.findAll();

      expect(result).toEqual(products);
      expect(mockProductRepository.find).toHaveBeenCalled();
    });

    it('should return one product', async () => {
      const productDto = {
        price: 100,
        category: Category.Ferreteria,
        idProduct: 1,
        description: 'test de product',
        amount: 5,
        product: 'test on products',
        images: 'fake images'
      };
      mockProductRepository.findOne.mockResolvedValue(productDto);

      const result = await productService.findOneProduct(productDto.idProduct);

      expect(result).toEqual(productDto);
      expect(mockProductRepository.findOne).toHaveBeenCalledWith({ where: { idProduct: productDto.idProduct } });
    });
  });

  describe('Testing over delete method', () => {
    it('should delete a product', async () => {
      const productDto = {
        price: 100,
        category: Category.Ferreteria,
        idProduct: 1,
        description: 'test de product',
        amount: 5,
        product: 'test on products',
        images: 'fake images'
      };
      mockProductRepository.findOne.mockResolvedValue(productDto);
      mockProductRepository.remove.mockResolvedValue(productDto);
  
      const result = await productService.removeProduct(productDto.idProduct);
  
      expect(result).toEqual(productDto);
    });
  })

  

});
