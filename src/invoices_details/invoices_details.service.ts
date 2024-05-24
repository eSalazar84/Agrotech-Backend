import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInvoicesDetailDto } from './dto/create-invoices_detail.dto';
import { UpdateInvoicesDetailDto } from './dto/update-invoices_detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoicesDetail } from './entities/invoices_detail.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { Product } from 'src/product/entities/product.entity';

@Injectable()
export class InvoicesDetailsService {
  constructor(@InjectRepository(InvoicesDetail) private readonly invoicesDetailsRepository: Repository<CreateInvoicesDetailDto>,
    @InjectRepository(Product) private readonly productRepository: Repository<CreateProductDto>) { }

  /* async createInv_Det(createInvoicesDetailDto: CreateInvoicesDetailDto): Promise<CreateInvoicesDetailDto> {
    if (createInvoicesDetailDto.amount_sold <= 0) throw new HttpException({
      status: HttpStatus.NOT_ACCEPTABLE, error: `debe ingresar un valor mayor que cero.`
    }, HttpStatus.NOT_ACCEPTABLE)
    const newInv_Det = this.invoicesDetailsRepository.create(createInvoicesDetailDto)
    return this.invoicesDetailsRepository.save(newInv_Det)
  } */

  async findAllDetailsInv_Det(): Promise<CreateInvoicesDetailDto[]> {
    return this.invoicesDetailsRepository.find({ relations: ['id_invoice', 'id_product'] });
  }

  async findOneInv_Det(id: number): Promise<CreateInvoicesDetailDto> {
    const query: FindOneOptions = { where: { idInvoicesDetails: id }, relations: ['id_invoice', 'id_product'] }
    const detailsFound = await this.invoicesDetailsRepository.findOne(query)
    if (!detailsFound) throw new HttpException({
      status: HttpStatus.NOT_FOUND, error: `No existe el detalle de factura n°${id}`
    }, HttpStatus.NOT_FOUND)
    return detailsFound;
  }

  async updateInv_Det(id: number, updateInvoicesDetailDto: UpdateInvoicesDetailDto): Promise<CreateInvoicesDetailDto> {
    const query: FindOneOptions = { where: { idInvoicesDetails: id } }
    const detailsFound = await this.invoicesDetailsRepository.findOne(query)
    if (!detailsFound) throw new HttpException({
      status: HttpStatus.NOT_FOUND, error: `No existe el detalle de factura n°${id}`
    }, HttpStatus.NOT_FOUND)
    if (updateInvoicesDetailDto.amount_sold <= 0) throw new HttpException({
      status: HttpStatus.NOT_ACCEPTABLE, error: `debe ingresar un valor mayor que cero.`
    }, HttpStatus.NOT_ACCEPTABLE)
    const updateUser = Object.assign(detailsFound, updateInvoicesDetailDto)
    return this.invoicesDetailsRepository.save(updateUser)
  }

  async removeInv_Det(id: number): Promise<CreateInvoicesDetailDto> {
    const query: FindOneOptions = { where: { idInvoicesDetails: id } }
    const detailsFound = await this.invoicesDetailsRepository.findOne(query)
    if (!detailsFound) throw new HttpException({
      status: HttpStatus.NOT_FOUND, error: `No existe el detalle de factura n°${id}`
    }, HttpStatus.NOT_FOUND)
    const removeDetails = await this.invoicesDetailsRepository.remove(detailsFound)
    return removeDetails
  }

  async addInvoiceDetail(invDetailData: CreateInvoicesDetailDto): Promise<CreateInvoicesDetailDto> {
    const productFound = await this.productRepository.findOne({ where: { idProduct: invDetailData.id_product } });
    if (!productFound) {
      throw new HttpException(`Product with ID ${invDetailData.id_product} not found`, HttpStatus.NOT_FOUND);
    }
    if (productFound.amount < invDetailData.amount_sold) {
      throw new HttpException('Insufficient stock for sale', HttpStatus.BAD_REQUEST);
    }

    // Update the stock in Product
    productFound.amount -= invDetailData.amount_sold;
    await this.productRepository.save(productFound);

    const invoiceDetail = this.invoicesDetailsRepository.create(invDetailData);
    return await this.invoicesDetailsRepository.save(invoiceDetail);
  }

}
