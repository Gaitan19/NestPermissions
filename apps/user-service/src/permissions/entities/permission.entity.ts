/* eslint-disable prettier/prettier */
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rol } from '../../rols/entities/rol.entity';

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column("simple-array")
    endpoints: string[]

    @Column("simple-array")
    method: string[]; 

    @ManyToMany(() => Rol, (rol) => rol.permissions)
    rols: Rol[];
}
