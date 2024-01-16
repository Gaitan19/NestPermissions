import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invoice } from '../../invoices/entities/invoice.entity';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @Column()
  address: string;

  @Column()
  phone: number;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  invoice: Invoice[];
}
