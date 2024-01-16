import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity()
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  rolName: string;

  @ManyToMany(() => Permission, (permission) => permission.rols)
  @JoinTable()
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.rols)
  users: User[];
}
