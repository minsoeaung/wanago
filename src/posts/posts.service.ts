import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PostNotFundException } from './exception/postNotFund.exception';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createPostDto: CreatePostDto, user: User) {
    // Sending categories with ids that does not exist should be ignored
    // Currently having 500 Error for these
    // Update -> check first if all categories exist
    if (
      Array.isArray(createPostDto.categories) &&
      createPostDto.categories.length > 0
    ) {
      const returnedCategories =
        await this.categoriesService.getCategoriesByIds(
          createPostDto.categories.map((category) => category.id),
        );
      if (returnedCategories.length !== createPostDto.categories.length) {
        throw new HttpException(
          'Some of the categories you supplied were not found',
          HttpStatus.NOT_FOUND,
        );
      }
    }

    const newPost = await this.postRepository.create({
      ...createPostDto,
      author: user,
    });
    await this.postRepository.save(newPost);
    return newPost;
  }

  findAll() {
    return this.postRepository.find({ relations: ['author', 'categories'] });
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author', 'categories'], // <- these strings cannot be wrong, but no type safety for these?
    });
    if (post) {
      return post;
    }
    throw new PostNotFundException(id);
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postRepository.update(id, updatePostDto);
    const updatedPost = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (updatedPost) {
      return updatedPost;
    }
    throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
  }

  async remove(id: number) {
    const deleteResponse = await this.postRepository.delete({ id });
    if (!deleteResponse.affected) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
  }
}
