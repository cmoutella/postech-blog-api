import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InterfacePost } from '../schemas/models/post.interface';
import { PostsService } from '../services/posts-collection.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';

@UseInterceptors(LoggingInterceptor)
@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  async createPost(@Body() post: InterfacePost) {
    await this.postsService.createPost(post);
  }

  @Get()
  async getAllPosts(page?: number, limit?: number) {
    return await this.postsService.getAllPosts(page, limit);
  }

  @Get()
  async getAllPostsByKeyword(
    @Body() { keyword }: { keyword: string },
    page?: number,
    limit?: number,
  ) {
    return await this.postsService.getAllPostsByKeyword(keyword, page, limit);
  }

  @Get(':id')
  async getOnePost(@Param('id') id: string) {
    return await this.postsService.getOnePost(id);
  }

  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body() data: Partial<InterfacePost>,
  ) {
    return await this.postsService.updatePost(id, data);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    await this.postsService.deletePost(id);
  }
}
