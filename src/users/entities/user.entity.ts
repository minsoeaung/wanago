import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Address } from './address.entity';
import { Exclude } from 'class-transformer';
import { Post } from '../../posts/entities/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  @Exclude()
  password: string;

  // A user can have only one address
  // One address can have only one user
  @OneToOne(() => Address, {
    eager: true,
    cascade: true,
  })
  // User entity own the relationship.
  // Rows of the table contain the addressId column (why?, this column is named as "address")
  // Use JoinColumn() only on one side of the relationship.
  // What happened for existing users?
  // What happened when you register and this field is missed out
  // What is default value?
  // @Transform(({ value }) => (value !== null ? value : undefined)) // Leave out if null
  @JoinColumn() // this decorator is optional for @ManyToOne, but required for @OneToOne
  // This JoinColumn will create addressId column in the database
  // It is a reference to some other columns using a foreign key
  address: Address;

  @OneToMany(() => Post, (post: Post) => post.author)
  posts: Post[];
}

// Saving the related entities
// Save the address while saving user with eager and cascade
