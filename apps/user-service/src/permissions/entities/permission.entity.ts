/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rol } from '../../rols/entities/rol.entity';

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    method: string; // Por ejemplo, 'GET', 'POST', 'PATCH', 'DELETE'

    @ManyToMany(() => Rol, (rol) => rol.permissions)
    rols: Rol[];
}
