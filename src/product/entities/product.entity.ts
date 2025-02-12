import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../../helpers/enums-type.enum";
import { InvoicesDetail } from "../../invoices_details/entities/invoices_detail.entity";
import { getThreeWords } from "../../helpers/helpers";


@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    idProduct: number

    @Column({ type: 'varchar', length: 10 })
    codeProduct: string

    @Column({ type: 'varchar', length: 45 })
    product: string

    @Column({ type: 'varchar' })
    description: string

    @Column({ type: 'int' })
    price: number

    @Column({ type: 'enum', enum: Category })
    category: Category

    @Column({ type: 'int' })
    amount: number

    @Column({ type: 'varchar' })
    images: string

    @Column({ type: 'boolean', default: true })
    active: boolean

    @BeforeInsert()
    @BeforeUpdate()
    getNameForCodeProduct() {
        this.codeProduct = getThreeWords(this.category)
    }

    @OneToMany(() => InvoicesDetail, invoiceDetail => invoiceDetail.product)
    public invoiceDetails: InvoicesDetail[]

}
