import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext' })
  image: string;

  // @Column({ type: 'text' })
  // base64Image: string;
}
