/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Email {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    email: string;

    @Column()
    date: Date;
}
