import { Controller, Get, Post, Body, Param, Delete, UsePipes, ValidationPipe, HttpStatus, ParseIntPipe, UseGuards, HttpException } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { IProduct } from '../product/interface/product.interface';
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
    try {
      return await this.invoiceService.findOneInvoice(id);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('user/:userId')
  async findInvoiceByUser(@Param('userId', ParseIntPipe) userId: number): Promise<Invoice[]> {
    return this.invoiceService.findInvoiceByUser(userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Invoice not found' })
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Promise<{ message: string, statusCode: number }> {
    return await this.invoiceService.removeInvoice(id);
  }
}
