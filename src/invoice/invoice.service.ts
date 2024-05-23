import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateInvoicesDetailDto } from 'src/invoices_details/dto/create-invoices_detail.dto';
import { InvoicesDetail } from 'src/invoices_details/entities/invoices_detail.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { IProduct } from 'src/product/interface/product.interface';
import { CreateProductDto } from 'src/product/dto/create-product.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<CreateInvoiceDto>,

    @InjectRepository(User)
    private userRepository: Repository<CreateUserDto>,

    @InjectRepository(InvoicesDetail)
    private invoicesDetailsRepository: Repository<CreateInvoicesDetailDto>,

    @InjectRepository(Product)
    private productRepository: Repository<CreateProductDto>,
  ) { }

  async findAllInvoice(): Promise<CreateInvoiceDto[]> {
    return this.invoiceRepository.find({ relations: ['invoiceDetails'] })
  }

  async findOneInvoice(id: number): Promise<CreateInvoiceDto> {
    const query: FindOneOptions = { where: { idInvoice: id }, relations: ['invoiceDetails'] }
    const invoiceFound = await this.invoiceRepository.findOne(query)
    if (!invoiceFound) throw new HttpException({
      status: HttpStatus.NOT_FOUND, error: `no existe una factura con el id ${id} `
    }, HttpStatus.NOT_FOUND)
    return invoiceFound;
  }

  async removeInvoice(id: number): Promise<CreateInvoiceDto> {
    const query: FindOneOptions = { where: { idInvoice: id } }
    const invoiceFound = await this.invoiceRepository.findOne(query)
    if (!invoiceFound) throw new HttpException({
      status: HttpStatus.NOT_FOUND, error: `no existe una factura con el id ${id} `
    }, HttpStatus.NOT_FOUND)
    const removeInvoice = await this.invoiceRepository.remove(invoiceFound)
    return removeInvoice
  }

  /* async addDetailsToInvoice(invoiceId: number, invDetailData: Partial<CreateInvoicesDetailDto>): Promise<CreateInvoiceDto> {
    const query: FindOneOptions = { where: { idInvoice: invoiceId } }
    const invoiceFound = await this.invoiceRepository.findOne(query)
    if (!invoiceFound) throw new HttpException({
      status: HttpStatus.NOT_FOUND, error: `No existe el producto con el id ${invoiceId}`
    }, HttpStatus.NOT_FOUND)

    await this.invoicesDetailsRepository.save(invDetailData);

    return await this.invoiceRepository.save(invoiceFound);
  } */

  /* async createInvoice(userId: number, productsId: IProduct): Promise<CreateInvoiceDto> {
    const query: FindOneOptions = { where: { idUser: userId } }
    const userFound = await this.userRepository.findOne(query)
    if (!userFound) {
      throw new Error('User not found');
    }

    // Primero, crea la factura (invoice)
    const invoice = this.invoiceRepository.create({
      total_without_iva: productsId.amount,
      id_user: userFound.idUser,
    });

    const savedInvoice = await this.invoiceRepository.save(invoice);

    let totalWithoutIva = 0;

    // Luego, crea los detalles de la factura (invoice details)
    const queryFound: FindOneOptions = { where: { idProduct: productsId.idProduct } }
    const productFound = await this.productRepository.findOne(queryFound)
    if (!productFound || productFound.amount < productsId.amount) {
      throw new Error('Inventory item not found or insufficient stock');
    }

    const detail = this.invoicesDetailsRepository.create({
      amount_sold: productsId.amount,
      id_product: productFound.idProduct,
      id_invoice: savedInvoice.idInvoice, // Usa la factura guardada que tiene un ID
    });

    await this.invoicesDetailsRepository.save(detail);

    productFound.amount -= productsId.amount;
    await this.productRepository.save(productFound);

    totalWithoutIva += productFound.price * productsId.amount;

    return await this.invoiceRepository.save(savedInvoice);
  } */

  
}
