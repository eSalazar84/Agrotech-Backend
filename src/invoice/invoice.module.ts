import { Module } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { InvoiceController } from './invoice.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice } from './entities/invoice.entity';
import { User } from '../user/entities/user.entity';
import { InvoicesDetail } from '../invoices_details/entities/invoices_detail.entity';
import { Product } from '../product/entities/product.entity';
import { InvoicesDetailsService } from '../invoices_details/invoices_details.service';
import { UserService } from '../user/user.service';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, User, InvoicesDetail, Product]),
    EmailModule
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoicesDetailsService, UserService],
  exports: [InvoiceService]
})
export class InvoiceModule { }
