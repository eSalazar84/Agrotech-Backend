import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { IProduct } from './interface/product.interface';
import { Category } from '../helpers/enums-type.enum';
import { UpdateProductDto } from './dto/update-product.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('ProductController', () => {
  let productController: ProductController;

  const mockedArrayProduct: IProduct[] = [
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
    },
    {
      idProduct: 2,
      codeProduct: "tra021",
      product: "tranquera",
      description: "para cerrar",
      price: 325980,
      category: Category.Ferreteria,
      amount: 5,
      images: "muestra_2",
      active: true
    },
    {
      idProduct: 3,
      codeProduct: "fer001",
      product: "destornillador",
      description: "para desatornillar",
      price: 2510,
      category: Category.Ferreteria,
      amount: 69,
      images: "muestra_3",
      active: true
    },
    {
      idProduct: 4,
      codeProduct: "rop026",
      product: "mameluco",
      description: "para vestir",
      price: 658532,
      category: Category.Ropa_de_trabajo,
      amount: 587,
      images: "muestra_4",
      active: true
    }
  ];

  const mockProductRepository = {
    findAll: jest.fn(() => mockedArrayProduct),
    findOneProduct: jest.fn((idProduct: number) => mockedArrayProduct.find(product => product.idProduct === idProduct)),
    findByCategory: jest.fn((category: string) => mockedArrayProduct.filter(product => product.category === category)),
    createProduct: jest.fn((createProductDto: IProduct) => {
      const newProduct = { idProduct: 1, ...createProductDto };
      mockedArrayProduct.push(newProduct);
      return newProduct;
    }),
    updateProduct: jest.fn((idProduct: number, updateProductDto: UpdateProductDto) => {
      const productIndex = mockedArrayProduct.findIndex(product => product.idProduct === idProduct);
      if (productIndex !== -1) {
        mockedArrayProduct[productIndex] = { ...mockedArrayProduct[productIndex], ...updateProductDto };
        return mockedArrayProduct[productIndex];
      } else {
        throw new HttpException(
          { status: HttpStatus.NOT_FOUND, error: 'Product not found' },
          HttpStatus.NOT_FOUND,
        );
      }
    }),
    removeProduct: jest.fn((id: number) => {
      const productIndex = mockedArrayProduct.findIndex(product => product.idProduct === id);
      if (productIndex !== -1) {
        return mockedArrayProduct.splice(productIndex, 1)[0];
      } else {
        return null;
      }
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [ProductService],
    })
      .overrideProvider(ProductService)
      .useValue(mockProductRepository)
      .compile();

    productController = module.get<ProductController>(ProductController);
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  describe('Testing over Read method', () => {
    it('should return all products', async () => {
      const productSpy = mockProductRepository.findAll();
      const productReal = await productController.findAll()
      expect(productReal).toBe(productSpy);
    });

    it('should return one product by id', async () => {
      const oneProductSpy = mockProductRepository.findOneProduct(mockedArrayProduct[0].idProduct)
      const oneProductReal = await productController.findOne(mockedArrayProduct[0].idProduct)
      expect(oneProductReal).toEqual(oneProductSpy);
    });
  });

  it('should return products by category', async () => {
    const category = Category.Ferreteria;
    const productSpyFilter = mockProductRepository.findByCategory(category)
    const productRealFilter = await productController.findAll(category)
    expect(productRealFilter).toEqual(productSpyFilter);
  });

  describe('Testting over delete method', () => {
    it('should delete a product by id', async () => {
      const deleteById = 1;
      const deleteProductSpy = mockProductRepository.removeProduct(deleteById);
      const deleteProductReal = await productController.removeProduct(deleteById);
      expect(deleteProductSpy.idProduct).toBe(deleteById);
      expect(deleteProductReal).toBeNull();
      expect(mockProductRepository.removeProduct).toHaveBeenCalledWith(deleteById);
    });
  })
});