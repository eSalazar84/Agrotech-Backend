import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { IProduct } from './interface/product.interface';
import { Category } from '../helpers/enums-type.enum';
import { Readable } from 'stream';

describe('ProductController', () => {
  let productController: ProductController;

  const mockedArrayProduct: IProduct[] = [
    {
      "idProduct": 1,
      "codeProduct": "Rop-8a0",
      "product": "botas",
      "description": "para caminar",
      "price": 10520,
      "category": Category.Ropa_de_trabajo,
      "amount": 20,
      "images": "C:\\fakepath\\IMG-20240513-WA0024.jpg"
    },
    {
      "idProduct": 2,
      "codeProduct": "tra021",
      "product": "tranquera",
      "description": "para cerrar",
      "price": 325980,
      "category": Category.Ferreteria,
      "amount": 5,
      "images": "muestra_2",
    },
    {
      "idProduct": 3,
      "codeProduct": "fer001",
      "product": "destornillador",
      "description": "para desatornillar",
      "price": 2510,
      "category": Category.Ferreteria,
      "amount": 69,
      "images": "muestra_3"
    },
    {
      "idProduct": 4,
      "codeProduct": "rop026",
      "product": "mameluco",
      "description": "para vestir",
      "price": 658532,
      "category": Category.Ropa_de_trabajo,
      "amount": 587,
      "images": "muestra_4",
    }
  ]

  const mockProductRepository = {
    findAll: jest.fn(() => mockedArrayProduct),
    findOneProduct: jest.fn((idProduct: number) => mockedArrayProduct.find(product => product.idProduct === idProduct)),
    findByCategory: jest.fn((category: string) => mockedArrayProduct.filter(product => product.category === category)),
    createProduct: jest.fn((newProduct: IProduct) => {
      mockedArrayProduct.push(newProduct);
      return newProduct;
    }),
    updateProduct: jest.fn((idProduct: number, updateProduct: Partial<IProduct>) => {
      const productIndex = mockedArrayProduct.findIndex(product => product.idProduct === idProduct);
      if (productIndex !== -1) {
        mockedArrayProduct[productIndex] = { ...mockedArrayProduct[productIndex], ...updateProduct };
        return mockedArrayProduct[productIndex];
      } else {
        return null;
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

  describe('Testing over create method', () => {
    it('should create a new product', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: 1024,
        destination: '/uploads',
        filename: 'test.png',
        path: '/uploads/test.png',
        buffer: Buffer.from('mock buffer data'),
        stream: Readable.from(Buffer.from('mock buffer data'))
      };
      
      module.exports = mockFile;
      const newProduct: IProduct = {
        idProduct: 15,
        codeProduct: "new001",
        product: "nuevo producto",
        description: "nuevo",
        price: 1000,
        category: Category.Ferreteria,
        amount: 10,
        images: mockFile.originalname
      }
      const productSpy = mockProductRepository.createProduct(newProduct)
      const productReal = await productController.create(
        newProduct.product,
        newProduct.description,
        newProduct.price,
        newProduct.category,
        newProduct.amount,
        mockFile
      )
      expect(productReal).toEqual(productSpy);
      expect(mockProductRepository.createProduct).toHaveBeenCalledWith(newProduct);
    });
  })

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

    it('should return products by category', async () => {
      const category = Category.Ferreteria;
      const productSpyFilter = mockProductRepository.findByCategory(category)
      const productRealFilter = await productController.findAll(category)
      expect(productRealFilter).toEqual(productSpyFilter);
    });
  })

  describe('Testing over update method', () => {
    it('should update an existing product', async () => {
      const mockFile = {
        fieldname: 'file',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: 1024,
        destination: '/uploads',
        filename: 'test.png',
        path: '/uploads/test.png',
        buffer: Buffer.from('mock buffer data'),
        stream: Readable.from(Buffer.from('mock buffer data'))
      };
      
      module.exports = mockFile;
      const updateProduct: Partial<IProduct> = {
        idProduct: 15,
        codeProduct: "new001",
        product: "nuevo producto",
        description: "nuevo",
        price: 1000,
        category: Category.Ferreteria,
        amount: 10,
        images: mockFile.originalname
      }
      const updateProductSpy = mockProductRepository.updateProduct(2, updateProduct)
      const updateProductReal = await productController.update(
        updateProduct.idProduct,
        updateProduct.product,
        updateProduct.description,
        updateProduct.price,
        updateProduct.category,
        updateProduct.amount,
        mockFile.stream   
      )
      expect(updateProductReal).toEqual(updateProductSpy);
      expect(mockProductRepository.updateProduct).toHaveBeenCalledWith(2, updateProduct);
    });
  })

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
