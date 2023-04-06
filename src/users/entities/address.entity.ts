import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '' })
  street: string;

  @Column({ default: '' })
  city: string;

  @Column({ default: '' })
  country: string;

  // Inverse relationship
  // I think this one is only for finding this Address
  // And does not have effect on database
  // Or
  // userId will exist in database?
  @OneToOne(() => User, (user: User) => user.address)
  user: User;

  //   userId does not show up currently
}

// OneToOne
// One address can be linked to one user,
// User cannot have more than one address
