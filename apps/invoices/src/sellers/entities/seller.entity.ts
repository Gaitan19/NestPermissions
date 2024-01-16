import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invoice } from '../../invoices/entities/invoice.entity';

@Entity()
export class Seller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  lastName: string;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Invoice, (invoice) => invoice.seller)
  invoice: Invoice[];
}
