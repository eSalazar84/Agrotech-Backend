import { Expose } from 'class-transformer'
import { IsString, IsNumber, IsEnum, IsNotEmpty, MaxLength, IsOptional } from 'class-validator'
import { Category } from '../../helpers/enums-type.enum'

export class CreateProductDto {
    /* @IsOptional()
    idProduct: number  */

    @IsString()
    @IsNotEmpty()
    @Expose()
    @MaxLength(45)
    readonly product: string

    @IsString()
    @IsNotEmpty()
    @Expose()
    @MaxLength(255)
    readonly description: string

    @IsNumber()
    @IsNotEmpty()
    @Expose()
    readonly price: number

    @IsEnum(Category)
    @IsNotEmpty()
    @Expose()
    readonly category: Category

    @IsNumber()
    @IsNotEmpty()
    @Expose()
    amount: number

    @IsOptional()
    @IsString()
    images: string
}
