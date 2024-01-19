import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Rol } from '../../rols/entities/rol.entity';

@Entity()
export class User {
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string | null;

  @ManyToMany(() => Rol, (rol) => rol.users)
  @JoinTable()
  rols: Rol[];
}
