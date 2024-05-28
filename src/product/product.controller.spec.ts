import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { IProduct } from './interface/product.interface';
import { Category } from '../helpers/enums-type.enum';

describe('ProductController', () => {
  let productController: ProductController;
  let productService: ProductService;

  const mockedArrayProduct: IProduct[] = [
    {
      "idProduct": 9,
      "codeProduct": "Rop-8a0",
      "product": "botas",
      "description": "para caminar",
      "price": 10520,
      "category": Category.Ropa_de_trabajo,
      "amount": 20,
      "images": "C:\\fakepath\\IMG-20240513-WA0024.jpg"
    },
    {
      "idProduct": 10,
      "codeProduct": "tra021",
      "product": "tranquera",
      "description": "para cerrar",
      "price": 325980,
      "category": Category.Ferreteria,
      "amount": 5,
      "images": "muestra_2",
    },
    {
      "idProduct": 11,
      "codeProduct": "fer001",
      "product": "destornillador",
      "description": "para desatornillar",
      "price": 2510,
      "category": Category.Ferreteria,
      "amount": 69,
      "images": "muestra_3"
    },
    {
      "idProduct": 12,
      "codeProduct": "rop026",
      "product": "mameluco",
      "description": "para vestir",
      "price": 658532,
      "category": Category.Ropa_de_trabajo,
      "amount": 587,
      "images": "muestra_4",
    },
    {
      "idProduct": 13,
      "codeProduct": "fer003",
      "product": "martillo",
      "description": "para golpear",
      "price": 21541521,
      "category": Category.Ferreteria,
      "amount": 15,
      "images": "muestra_5",
    },
    {
      "idProduct": 14,
      "codeProduct": "tra100",
      "product": "porton",
      "description": "para bloquear",
      "price": 51651,
      "category": Category.Ferreteria,
      "amount": 3,
      "images": "muestra_6",
    }
  ]

  const mockProductRepository = {
    findAll: jest.fn(() => mockedArrayProduct),
    findOne: jest.fn((idProduct: number) => mockedArrayProduct.find(product => product.idProduct === idProduct)),
    findByCategory: jest.fn((category: string) => mockedArrayProduct.filter(product => product.category === category)),
    create: jest.fn((newProduct: IProduct) => {
      mockedArrayProduct.push(newProduct);
      return newProduct;
    }),
    update: jest.fn((idProduct: number, updateProduct: Partial<IProduct>) => {
      const productIndex = mockedArrayProduct.findIndex(product => product.idProduct === idProduct);
      if (productIndex !== -1) {
        mockedArrayProduct[productIndex] = { ...mockedArrayProduct[productIndex], ...updateProduct };
        return mockedArrayProduct[productIndex];
      } else {
        return null;
      }
    }),
    remove: jest.fn((idProduct: number) => {
      const index = mockedArrayProduct.findIndex(product => product.idProduct === idProduct);
      if (index !== -1) {
        return mockedArrayProduct.splice(index, 1)[0]; // Elimina el usuario y devuelve el usuario eliminado
      } else {
        return null; // Devuelve null si no se encuentra el usuario
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
    productService = module.get<ProductService>(ProductService)
  });

  it('should be defined', () => {
    expect(productController).toBeDefined();
  });

  it('should return all products', async () => {
    const products = await productController.findAll();
    expect(products).toBe(mockedArrayProduct);
  });

  it('should return one product by id', async () => {
    const oneProduct = await productController.findOne(1);
    const mockProduct = mockProductRepository.findOne(1)
    expect(oneProduct).toEqual(mockProduct);
  });

  it('should return products by category', async () => {
    const category = Category.Ferreteria;
    const productsByCategory = await productController.findAll(category);
    expect(productsByCategory).toEqual(mockProductRepository.findByCategory(category));
  });

  it('should create a new product', async () => {
    const newProduct: IProduct = {
      idProduct: 15,
      codeProduct: "new001",
      product: "nuevo producto",
      description: "nuevo",
      price: 1000,
      category: Category.Ferreteria,
      amount: 10,
      images: "nueva_imagen",
    };
    const createdProduct = await productController.create(newProduct);
    expect(createdProduct).toEqual(newProduct);
    expect(mockProductRepository.create).toHaveBeenCalledWith(newProduct);
  });

  it('should update an existing product', async () => {
    const updateProduct: Partial<IProduct> = {
      product: "producto actualizado",
      price: 9999,
    };
    const updatedProduct = await productController.update(1, updateProduct);
    expect(updatedProduct).toEqual({ ...mockedArrayProduct[0], ...updateProduct });
    expect(mockProductRepository.update).toHaveBeenCalledWith(1, updateProduct);
  });

  it('should delete a product by id', async () => {
    const deletedProduct = await productController.removeProduct(1);
    expect(deletedProduct).toEqual(mockedArrayProduct[0]);
    expect(mockProductRepository.remove).toHaveBeenCalledWith(1);
  });
});
