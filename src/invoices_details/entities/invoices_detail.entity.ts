import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Invoice } from "src/invoice/entities/invoice.entity";

import { Product } from 'src/product/entities/product.entity';

@Entity()
export class InvoicesDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount_sold: number;

  @ManyToOne(() => Invoice, invoice => invoice.invoiceDetails)
  invoice: Invoice;

  @ManyToOne(() => Product, product => product.invoiceDetails)
  product: Product;
}

