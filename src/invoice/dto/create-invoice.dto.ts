import { Expose } from 'class-transformer';
import { IsNumber, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateInvoiceDto {
  @IsDateString()
  @Expose()
  readonly invoiceDate: Date;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  total_without_iva: number;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  total_with_iva: number;

  @IsNumber()
  @IsNotEmpty()
  @Expose()
  readonly id_user: number;
}


