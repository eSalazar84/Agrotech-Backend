import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, FindOneOptions } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { User } from '../user/entities/user.entity';
import { Product } from '../product/entities/product.entity';
import { InvoicesDetail } from '../invoices_details/entities/invoices_detail.entity';
import { IProduct } from '../product/interface/product.interface';
import { MailService } from '../mail/mail.service';


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
    private readonly mailService: MailService
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

      // Lista para almacenar los detalles de los productos vendidos
      const soldProductsDetails = [];

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

        // Añadir detalles del producto vendido a la lista
        soldProductsDetails.push({
          product: productFound.product,
          price: productFound.price,
          amount: item.amount
        });
      }

      savedInvoice.total_without_iva = totalWithoutIva;
      savedInvoice.total_with_iva = totalWithoutIva * 1.21;

      const finalInvoice = await queryRunner.manager.save(savedInvoice);

      await queryRunner.commitTransaction();

      // Envío del correo electrónico con los detalles de los productos vendidos
      await this.mailService.sendPurchaseConfirmationEmail(userFound.email, finalInvoice, soldProductsDetails);

      return {
        invoiceDate: finalInvoice.invoiceDate,
        total_without_iva: finalInvoice.total_without_iva,
        total_with_iva: finalInvoice.total_with_iva,
        id_user: userFound.idUser,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }

  async findAllInvoice(): Promise<Invoice[]> {
    const invoices = await this.invoiceRepository.find({ relations: ['user', 'invoiceDetails', 'invoiceDetails.product'] });
    return invoices;
  }

  async findOneInvoice(id: number): Promise<Invoice> {
    const invoice = await this.invoiceRepository.findOne({
      where: { idInvoice: id },
      relations: ['user', 'invoiceDetails', 'invoiceDetails.product']
    });
    if (!invoice) {
      throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);
    }
    return invoice;
  }

  async findInvoiceByUser(userId: number): Promise<Invoice[]> {
    const invoices = await this.invoiceRepository.find({
      where: { user: { idUser: userId } },
      relations: ['user', 'invoiceDetails', 'invoiceDetails.product'],
    });
    if (!invoices.length) {
      throw new HttpException('No invoices found for this user', HttpStatus.NOT_FOUND);
    }
    return invoices;
  }

  async removeInvoice(invoiceId: number): Promise<{ message: string, statusCode: number }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Encontrar la factura y los detalles de la factura
      const invoice = await queryRunner.manager.findOne(Invoice, {
        where: { idInvoice: invoiceId },
        relations: ['invoiceDetails', 'invoiceDetails.product']
      });

      if (!invoice) {
        throw new HttpException('Invoice not found', HttpStatus.NOT_FOUND);
      }

      // Restablecer las cantidades de los productos
      for (const detail of invoice.invoiceDetails) {
        if (detail.product) {
          const product = await queryRunner.manager.findOne(Product, { where: { idProduct: detail.product.idProduct } });

          if (product) {
            product.amount += detail.amount_sold;
            await queryRunner.manager.save(product);
          }
        }
      }

      // Eliminar los detalles de la factura
      await queryRunner.manager.delete(InvoicesDetail, { invoice: { idInvoice: invoiceId } });

      // Eliminar la factura
      await queryRunner.manager.delete(Invoice, { idInvoice: invoiceId });

      await queryRunner.commitTransaction();

      return { statusCode: HttpStatus.OK, message: 'Invoice deleted successfully' };
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    } finally {
      await queryRunner.release();
    }
  }



}
