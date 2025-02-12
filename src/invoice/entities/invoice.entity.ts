import { InvoicesDetail } from "../../invoices_details/entities/invoices_detail.entity";
import { User } from "../../user/entities/user.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Invoice {
    @PrimaryGeneratedColumn()
    idInvoice: number

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    invoiceDate: Date

    @Column({ type: 'int' })
    total_without_iva: number

    @Column({ type: 'int' })
    total_with_iva: number

    @ManyToOne(() => User, user => user.invoice)
    public user: User

    @OneToMany(() => InvoicesDetail, invoiceDetail => invoiceDetail.invoice)
    public invoiceDetails: InvoicesDetail[]

    @BeforeInsert()
    @BeforeUpdate()
    private calculateTotalWithIva() {
        this.total_with_iva = this.total_without_iva * 1.21
    }

    constructor(invoiceDate: Date, total_without_iva: number) {
        this.invoiceDate = invoiceDate;
        this.total_without_iva = total_without_iva;
        this.calculateTotalWithIva()
    }

}

