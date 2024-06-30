import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateInvoicesDetailDto } from './dto/create-invoices_detail.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoicesDetail } from './entities/invoices_detail.entity';
import { FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class InvoicesDetailsService {
  constructor(
    @InjectRepository(InvoicesDetail) private readonly invoicesDetailsRepository: Repository<CreateInvoicesDetailDto>
  ) { }

  async findAllDetailsInv_Det(): Promise<CreateInvoicesDetailDto[]> {
    return this.invoicesDetailsRepository.find({ relations: ['invoice', 'product'] });
  }

  async findOneInv_Det(id: number): Promise<CreateInvoicesDetailDto> {
    const query: FindOneOptions = { where: { idDetails: id }, relations: ['invoice', 'product'] }
    const detailsFound = await this.invoicesDetailsRepository.findOne(query)
    if (!detailsFound) throw new HttpException({
      status: HttpStatus.NOT_FOUND,
      error: `No existe el detalle de factura n°${id}`
    }, HttpStatus.NOT_FOUND)
    return detailsFound;
  }
}
