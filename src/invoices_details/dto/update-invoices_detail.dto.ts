import { PartialType } from '@nestjs/mapped-types';
import { CreateInvoicesDetailDto } from './create-invoices_detail.dto';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateInvoicesDetailDto extends PartialType(CreateInvoicesDetailDto) {
    @Expose()
    @IsNumber()
    @IsNotEmpty()
    amount_sold?: number

    @Expose()
    @IsNotEmpty()
    readonly id_product?: number

    @Expose()
    @IsNotEmpty()
    readonly id_invoice?: number

    price_at_purchase:number
}
