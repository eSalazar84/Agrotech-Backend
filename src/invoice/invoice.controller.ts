import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, HttpStatus, ParseIntPipe, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { CreateInvoicesDetailDto } from 'src/invoices_details/dto/create-invoices_detail.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { CreateProductDto } from 'src/product/dto/create-product.dto';
import { IProduct } from 'src/product/interface/product.interface';
import { UserService } from 'src/user/user.service';
import { InvoicesDetailsService } from 'src/invoices_details/invoices_details.service';

@ApiTags('invoices')
@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly userService: UserService,
    private readonly invoicesDetailsService: InvoicesDetailsService
  ) { }

  @Get()
  async findAll(): Promise<CreateInvoiceDto[]> {
    return await this.invoiceService.findAllInvoice();
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

  @Post()
  async createInvoice(
    @Body('invoice') createInvoiceDto: CreateInvoiceDto,
    @Body('details') createInvoiceDetailsDto: CreateInvoicesDetailDto
  ): Promise<CreateInvoicesDetailDto> {
    const { id_user, total_without_iva } = createInvoiceDto;
    const { amount_sold, id_product } = createInvoiceDetailsDto;
    const createInvoice = await this.userService.createInvoiceForUser(id_user, total_without_iva)
    const createInvoicesDetails = await this.invoicesDetailsService.addInvoiceDetail(
      amount_sold,
      id_product,
      createInvoice.idInvoice
    )
    return createInvoicesDetails
  }

  /*
  para crear la facturacion al usuario en user.controller.ts
  async createInvoiceForUser(userId: number, invoiceData: CreateInvoiceDto): Promise<CreateInvoiceDto> {
    const query: FindOneOptions = { where: { idUser: userId } }
    const userFound = await this.userRepository.findOne(query)
    if (!userFound || userFound.active === false) throw new HttpException({
      status: HttpStatus.NOT_FOUND, error: `No existe el usuario con el id ${userId}`
    }, HttpStatus.NOT_FOUND)
    const newInvoice = this.invoiceRepository.create(invoiceData)
    await this.invoiceRepository.save(newInvoice)
    return newInvoice
  }
  
  para crear el detalle de la facturacion en invoice-details.controller.ts
  @Post()
  @ApiNotFoundResponse({ description: 'Invoice detail not found' })
  @ApiBadRequestResponse({ description: 'Request not valid' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createInvoiceForProduct(@Body() createinvoiceDetailsData: CreateInvoicesDetailDto): Promise<CreateInvoicesDetailDto> {
    return this.invoicesDetailsService.addInvoiceDetail(createinvoiceDetailsData);
  }
  
  
  */
}
