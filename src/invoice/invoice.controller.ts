import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpStatus, ParseIntPipe, UseGuards, HttpException } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { CreateInvoicesDetailDto } from 'src/invoices_details/dto/create-invoices_detail.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { IProduct } from 'src/product/interface/product.interface';
import { Invoice } from './entities/invoice.entity';


@ApiTags('invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly userService: UserService,
    private readonly invoicesDetailsService: InvoicesDetailsService
  ) { }

  @Get()
  async findAll(): Promise<Invoice[]> {
    try {
      return await this.invoiceService.findAllInvoice();
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Invoice not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Promise<CreateInvoiceDto> {
    return await this.invoiceService.findOneInvoice(id);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Invoice not found' })
  async remove(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Promise<CreateInvoiceDto> {
    return await this.invoiceService.removeInvoice(id);
  }

  /* @Post(':id/invoices-details')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvoiceForProduct(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number, @Body() createinvoiceDetailsData: Partial<CreateInvoicesDetailDto>): Promise<CreateInvoiceDto> {
    return this.invoiceService.addDetailsToInvoice(id, createinvoiceDetailsData);
  } */

  @Post(':userId')
  async createInvoice(
    @Param('userId') userId: number,
    @Body('products') products: IProduct[],
  ): Promise<CreateInvoiceDto> {
    try {
      return await this.invoiceService.createInvoice(userId, products);
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  
  */
}
