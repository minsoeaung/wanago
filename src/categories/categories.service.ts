import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { In, Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const createdCategory = await this.categoryRepository.create(
      createCategoryDto,
    );
    await this.categoryRepository.save(createdCategory);
    return createdCategory;
  }

  findAll() {
    return this.categoryRepository.find({ relations: ['posts'] });
  }

  findOne(id: number) {
    return this.categoryRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepository.update(id, updateCategoryDto);
    const updatedCategory = await this.categoryRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (updatedCategory) {
      return updatedCategory;
    }
    throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
  }

  remove(id: number) {
    return this.categoryRepository.delete(id);
  }

  async getCategoriesByIds(categoryIds: number[]) {
    return await this.categoryRepository.find({
      where: {
        id: In(categoryIds),
      },
    });
  }
}
