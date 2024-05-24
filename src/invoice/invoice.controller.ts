import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, HttpStatus, ParseIntPipe, UseGuards, HttpException } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { IProduct } from 'src/product/interface/product.interface';
import { Invoice } from './entities/invoice.entity';


@ApiTags('invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService
  ) { }

  @Post(':id')
  async createInvoice(
    @Param('id') userId: number,
    @Body('products') products: IProduct[],
  ): Promise<CreateInvoiceDto> {
    try {
      return await this.invoiceService.createInvoice(userId, products);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll(): Promise<Invoice[]> {
    return await this.invoiceService.findAllInvoice();
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Invoice not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Promise<Invoice> {
    return await this.invoiceService.findOneInvoice(id);
  }


  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Invoice not found' })
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Promise<Invoice> {
    return await this.invoiceService.removeInvoice(id);
  }
}
