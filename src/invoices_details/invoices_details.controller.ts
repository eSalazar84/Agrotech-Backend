import { Controller, Get, Param, UsePipes, ValidationPipe, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { InvoicesDetailsService } from './invoices_details.service';
import { CreateInvoicesDetailDto } from './dto/create-invoices_detail.dto';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('invoices-details')
@Controller('invoices-details')
export class InvoicesDetailsController {
  constructor(private readonly invoicesDetailsService: InvoicesDetailsService) { }

  @Get()
  findAll(): Promise<CreateInvoicesDetailDto[]> {
    return this.invoicesDetailsService.findAllDetailsInv_Det();
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Invoices-details not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number) {
    return this.invoicesDetailsService.findOneInv_Det(id);
  }
}


