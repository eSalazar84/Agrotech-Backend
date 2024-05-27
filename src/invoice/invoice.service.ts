import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, FindOneOptions } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { InvoicesDetail } from 'src/invoices_details/entities/invoices_detail.entity';
import { IProduct } from 'src/product/interface/product.interface';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(InvoicesDetail)
    private readonly invoicesDetailsRepository: Repository<InvoicesDetail>,
    private readonly dataSource: DataSource,
  ) { }

  async createInvoice(userId: number, products: IProduct[]): Promise<CreateInvoiceDto> {
    const query: FindOneOptions<User> = { where: { idUser: userId } };
    const userFound = await this.userRepository.findOne(query);
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const invoiceDate = new Date();
      const initialTotalWithoutIva = 0;

      const invoice = this.invoiceRepository.create({ invoiceDate, total_without_iva: initialTotalWithoutIva, user: userFound });
      const savedInvoice = await queryRunner.manager.save(invoice);
      let totalWithoutIva = 0;

      for (const item of products) {
        const queryProduct: FindOneOptions<Product> = { where: { idProduct: item.idProduct } };
        const productFound = await queryRunner.manager.findOne(Product, queryProduct);

        if (!productFound || productFound.amount < item.amount) {
          throw new HttpException(`Product with ID ${item.idProduct} not found or insufficient stock`, HttpStatus.BAD_REQUEST);
        }

        const invoiceDetail = this.invoicesDetailsRepository.create({
          amount_sold: item.amount,
          invoice: savedInvoice,
          product: productFound,
        });

        await queryRunner.manager.save(invoiceDetail);

        productFound.amount -= item.amount;
        await queryRunner.manager.save(productFound);

        totalWithoutIva += productFound.price * item.amount;
      }

      savedInvoice.total_without_iva = totalWithoutIva;
      savedInvoice.total_with_iva = totalWithoutIva * 1.21;
      const finalInvoice = await queryRunner.manager.save(savedInvoice);

      await queryRunner.commitTransaction();

      const invoiceDto: CreateInvoiceDto = {
        invoiceDate: finalInvoice.invoiceDate,
        total_without_iva: finalInvoice.total_without_iva,
        total_with_iva: finalInvoice.total_with_iva,
        id_user: userFound.idUser,  // Usa la propiedad correcta aquí
      };

      return invoiceDto;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async findAllInvoice(): Promise<Invoice[]> {
    try {
      console.log('Attempting to retrieve all invoices...');
      const invoices = await this.invoiceRepository.find({ relations: ['user', 'invoiceDetails', 'invoiceDetails.product'] });
      console.log('Invoices retrieved:', invoices);
      return invoices;
    } catch (error) {
      console.error('Error retrieving invoices:', error);
      throw new HttpException('Failed to retrieve invoices', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneInvoice(id: number): Promise<Invoice> {
    try {
      console.log('Attempting to retrieve invoice with ID:', id);
      const invoice = await this.invoiceRepository.findOne({ where: { idInvoice: id }, relations: ['user', 'invoiceDetails', 'invoiceDetails.product'] });

      if (!invoice) {
        throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);
      }
      console.log('Invoice retrieved:', invoice);
      return invoice;
    } catch (error) {
      console.error('Error retrieving invoice:', error);
      throw new HttpException('Failed to retrieve invoice', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  async findInvoiceByUser(userId: number): Promise<Invoice[]> {
    try {
      const invoices = await this.invoiceRepository.find({
        where: { user: { idUser: userId } },
        relations: ['user', 'invoiceDetails', 'invoiceDetails.product'],
      });

      if (!invoices.length) {
        throw new HttpException('No invoices found for this user', HttpStatus.NOT_FOUND);
      }

      return invoices;
    } catch (error) {
      console.error('Error retrieving invoices:', error);
      throw new HttpException('Failed to retrieve invoices', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeInvoice(id: number): Promise<Invoice> {
    const query: FindOneOptions = { where: { idInvoice: id } }
    const invoiceFound = await this.invoiceRepository.findOne(query)
    if (!invoiceFound) throw new HttpException({
      status: HttpStatus.NOT_FOUND, error: `no existe una factura con el id ${id} `
    }, HttpStatus.NOT_FOUND)
    const removeInvoice = await this.invoiceRepository.remove(invoiceFound)
    return removeInvoice
  }
}
