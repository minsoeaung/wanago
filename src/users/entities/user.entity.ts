import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Expose } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  @Expose()
  email: string;

  @Column()
  @Expose()
  name: string;

  @Column()
  password: string;
}
