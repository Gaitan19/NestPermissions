import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DecimalColumnTransformer } from '../../utils/columnNumericTransformer';
import { InvoiceDetail } from '../../invoice-details/entities/invoice-detail.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  unitofmeasure: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: new DecimalColumnTransformer(),
  })
  price: number;

  @Column()
  stock: number;

  @OneToMany(() => InvoiceDetail, (invoiceDetail) => invoiceDetail.product)
  invoiceDetails: InvoiceDetail[];

  @DeleteDateColumn()
  deletedAt: Date;
}
