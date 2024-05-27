import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, FindOneOptions } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { User } from 'src/user/entities/user.entity';
import { Product } from 'src/product/entities/product.entity';
import { InvoicesDetail } from 'src/invoices_details/entities/invoices_detail.entity';
import { IProduct } from 'src/product/interface/product.interface';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(User)
    private readonly userRepository: Repository<CreateUserDto>,
    @InjectRepository(InvoicesDetail)
    private readonly invoicesDetailsRepository: Repository<InvoicesDetail>,
    private readonly dataSource: DataSource,
  ) { }

  async createInvoice(idUser: number, products: IProduct[]): Promise<CreateInvoiceDto> {
    const query: FindOneOptions<CreateUserDto> = { where: { idUser } };
    const userFound = await this.userRepository.findOne(query);
    if (!userFound) throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: `No existe el usuario con el id ${idUser}`
    }, HttpStatus.NOT_FOUND)

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
          throw new HttpException({
            status: HttpStatus.BAD_REQUEST,
            error: `El producto con el id ${item.idProduct} no fue encontrado o no hay suficiente stock`,
          },
            HttpStatus.BAD_REQUEST
          );
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
        id_user: userFound.idUser, 
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
    return this.invoiceRepository.find({ relations: ['invoiceDetails', 'invoiceDetails.product'] })
  }

  async findOneInvoice(id: number): Promise<Invoice> {
    const query: FindOneOptions = { where: { idInvoice: id }, relations: ['user', 'invoiceDetails'] }
    const invoiceFound = await this.invoiceRepository.findOne(query)
    if (!invoiceFound) throw new HttpException({
      status: HttpStatus.NOT_FOUND, error: `no existe una factura con el id ${id} `
    }, HttpStatus.NOT_FOUND)
    return invoiceFound;
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
