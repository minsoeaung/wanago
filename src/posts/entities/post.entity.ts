import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Transform } from 'class-transformer';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  @Transform(({ value }) => (value !== null ? value : ''))
  category?: string;

  // *** This one does not have JoinColumn, but it will have authorId in database

  @ManyToOne(() => User, (author: User) => author.posts)
  author: User; // authorId is stored in the database

  // This post store the id of the author but user does not store

  // This column is nullable
  // If we send null to client, it is not good-looking
  // At least change it to empty string or leave this field
  // Be it null and send "" or leave out the field when sending to client
  // Or default value is ""
  // @Column({ nullable: true })
  // @Transform(({ value }) => (value !== null ? value : ''))
  // note?: string;
  // I think it is more convenient to send empty string for frontend
  // A property should only have one type, <once a string, always a string>
  // Once null, next string is not good
}

// Recursively exclude null value
// https://wanago.io/2020/06/08/api-nestjs-serializing-response-interceptors/
