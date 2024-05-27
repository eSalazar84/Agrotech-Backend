import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { User } from 'src/user/entities/user.entity';
import { InvoicesDetail } from 'src/invoices_details/entities/invoices_detail.entity';
import { Product } from 'src/product/entities/product.entity';
import { InvoicesDetailsService } from 'src/invoices_details/invoices_details.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, User, InvoicesDetail, Product])],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoicesDetailsService, UserService],
  exports: [InvoiceService]
})
export class InvoiceModule { }
