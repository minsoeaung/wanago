import { NotFoundException } from '@nestjs/common';

export class PostNotFundException extends NotFoundException {
  constructor(id: number) {
    super(`Post with id ${id} not found`);
  }
}
