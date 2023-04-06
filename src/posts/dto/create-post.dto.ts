import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Category {
  @IsNumber()
  id: number;
}

export class CreatePostDto {
  @IsString()
  content: string;

  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Category)
  categories?: Category[];
}
