import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "src/helpers/enums-type.enum";
import { InvoicesDetail } from "src/invoices_details/entities/invoices_detail.entity";
import { getThreeWords } from "src/helpers/helpers";
import { Invoice } from "src/invoice/entities/invoice.entity";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    idProduct: number

    @Column({ type: 'varchar', length: 8 })
    codeProduct: string

    @Column({ type: 'varchar', length: 45 })
    product: string

    @Column({ type: 'varchar', length: 255 })
    description: string

    @Column({ type: 'int' })
    price: number

    @Column({ type: 'enum', enum: Category })
    category: Category

    @Column({ type: 'int' })
    amount: number

    @Column({ type: 'varchar', length: 255 })
    images: string

    @BeforeInsert()
    @BeforeUpdate()
    getNameForCodeProduct() {
        this.codeProduct = getThreeWords(this.category)
    }
    // @OneToMany(() => Invoice, invoice => invoice.product)
    // invoices: Invoice[];
    @OneToMany(() => InvoicesDetail, invoiceDetail => invoiceDetail.product)
    public invoiceDetails: InvoicesDetail[]

}
