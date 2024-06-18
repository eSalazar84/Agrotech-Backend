import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { Expose } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { Category } from '../../helpers/enums-type.enum';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsString()
    @IsNotEmpty()
    @Expose()
    @MaxLength(45)
    readonly product?: string;

    @IsString()
    @IsNotEmpty()
    @Expose()
    @MaxLength(255)
    readonly description?: string;

    @IsNumber()
    @IsNotEmpty()
    @Expose()
    readonly price?: number;

    @IsEnum(Category)
    @IsNotEmpty()
    @Expose()
    readonly category?: Category;

    @IsNumber()
    @IsNotEmpty()
    @Expose()
    amount?: number;

    @IsOptional()
    @IsString()
    images?: string;
}
