import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, ParseIntPipe, ValidationPipe, UsePipes, Query, UseInterceptors, UploadedFile, HttpException, ParseFloatPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../helpers/enums-type.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, renameFile } from '../helpers/helpers';
import { ApiBadRequestResponse, ApiBody, ApiConflictResponse, ApiConsumes, ApiCreatedResponse, ApiNoContentResponse, ApiNotFoundResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { v2 as cloudinary } from 'cloudinary';
import * as path from 'path';
import * as fs from 'fs';

@ApiTags('products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiCreatedResponse({ description: 'Product succefully created' })
  @ApiBadRequestResponse({ description: 'Request not valid' })
  @ApiConflictResponse({ description: 'Product name already exist in the db' })
  @UseInterceptors(FileInterceptor('images', {
    storage: diskStorage({
      destination: './uploads-images',
      filename: renameFile
    }),
    fileFilter: fileFilter
  }))
  async create(
    @Body('product') product: string,
    @Body('description') description: string,
    @Body('price', ParseFloatPipe) price: number,
    @Body('category') category: Category,
    @Body('amount', ParseIntPipe) amount: number,
    @Body('active') active:boolean,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CreateProductDto> {
    if (!file) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Image file is required' },
        HttpStatus.BAD_REQUEST,
      );
    }

    const uploadPath = path.join(process.cwd(), 'uploads-images', file.filename);

    try {
      const result = await cloudinary.uploader.upload(uploadPath, {
        public_id: `${Date.now()}`,
        resource_type: 'auto',
      });

      // Combina las imágenes cargadas con otros datos del DTO
      const createProductDto: CreateProductDto = {
        product,
        description,
        price,
        category,
        amount,
        active,
        images: result.secure_url
      };
      fs.unlinkSync(uploadPath);

      return await this.productService.createProduct(createProductDto);
    } catch (err) {
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error: 'Failed to upload image' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiNoContentResponse({ description: `There's no content for this product` })
  async findAll(@Query('category') category?: Category): Promise<CreateProductDto[]> {
    if (category) {
      return await this.productService.findByCategory(category)
    } else {
      return await this.productService.findAll()
    }
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Product not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Promise<CreateProductDto> {
    return await this.productService.findOneProduct(id);
  }

  @Patch(':id')
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiBadRequestResponse({ description: 'Request not valid' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(FileInterceptor('images', {
    storage: diskStorage({
      destination: './uploads-images',
      filename: renameFile
    }),
    fileFilter: fileFilter
  }))

  async update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body('product') product: string,
    @Body('description') description: string,
    @Body('price', ParseFloatPipe) price: number,
    @Body('category') category: Category,
    @Body('amount', ParseIntPipe) amount: number,
  ): Promise<UpdateProductDto> {
    let images: string | undefined;

    // Si hay un archivo de imagen cargado, establece 'images'
    if (file) {
      const uploadPath = path.join(process.cwd(), 'uploads-images', file.filename);

      try {
        const result = await cloudinary.uploader.upload(uploadPath, {
          public_id: `${Date.now()}`,
          resource_type: 'auto',
        });

        images = result.secure_url;
        fs.unlinkSync(uploadPath);
      } catch (err) {
        throw new HttpException(
          { status: HttpStatus.BAD_REQUEST, error: 'Failed to upload image' },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const updateProductDto: UpdateProductDto = {
      product,
      description,
      price,
      category,
      amount,
      images,
    };

    return await this.productService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized access' })
  async removeProduct(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })) id: number): Promise<CreateProductDto> {
    return this.productService.removeProduct(id);
  }

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'List of products',
    type: CreateProductDto,
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: renameFile
    }),
    fileFilter: fileFilter
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: `No se proporcionó ningun archivo-`
      }, HttpStatus.BAD_REQUEST)
    }

    return await this.productService.uploadProductsFromCsv(file)
  }
}