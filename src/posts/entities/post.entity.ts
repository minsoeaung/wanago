import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Transform } from 'class-transformer';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @Column()
  title: string;

  // This column is nullable
  // If we send null to client, it is not good-looking
  // At least change it to empty string or leave this field
  // Be it null and send "" or leave out the field when sending to client
  // Or default value is ""
  @Column({ nullable: true })
  @Transform(({ value }) => (value !== null ? value : ''))
  note?: string;
  // I think it is more convenient to send empty string for frontend
  // A property should only have one type, <once a string, always a string>
  // Once null, next string is not good
}

// Recursively exclude null value
// https://wanago.io/2020/06/08/api-nestjs-serializing-response-interceptors/
