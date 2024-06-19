import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { InterfacePost } from '../schemas/models/post.interface';
import { PostsService } from '../services/posts-collection.service';

@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createPost(@Body() post: InterfacePost) {
    await this.postsService.createPost(post);
  }

  @Get()
  async getAllPosts(page?: number, limit?: number) {
    return this.postsService.getAllPosts(page, limit);
  }

  @Get()
  async getAllPostsByKeyword(
    @Body() { keyword }: { keyword: string },
    page?: number,
    limit?: number,
  ) {
    return this.postsService.getAllPostsByKeyword(keyword, page, limit);
  }

  @Get(':id')
  async getOnePost(@Param('id') id: string) {
    return this.postsService.getOnePost(id);
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() data: Partial<InterfacePost>,
  ) {
    return this.postsService.updatePost(id, data);
  }

  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    await this.postsService.deletePost(id);
  }
}
