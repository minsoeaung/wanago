import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request, Response } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    // return new Promise((foo) => setTimeout(foo, 5000));
    // https://docs.nestjs.com/controllers#request-object
    // We can use the library-specific (e.g., Express) response object,
    // which can be injected using the @Res() decorator in the method handler signature (e.g., findAll(@Res() response)).
    // With this approach, you have the ability to use the native response handling methods exposed by that object.
    // For example, with Express, you can construct responses using code like response.status(200).send().
    // response.status(200).send();

    // The standard approach is automatically disabled if you use express response
    // To use both, must set passThrough option to true
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    // "+" in "+id" makes id to be a number
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}