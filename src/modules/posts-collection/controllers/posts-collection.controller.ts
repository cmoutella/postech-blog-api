import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { z } from 'zod';

import { PostsService } from '../services/posts-collection.service';
import { AuthGuard } from '../../../shared/guards/auth.guard';
import { LoggingInterceptor } from '../../../shared/interceptors/logging.interceptor';
import { ZodValidationPipe } from '../../../shared/pipe/zod-validation.pipe';

const createPostSchema = z.object({
  title: z.string(),
  text: z.string(),
  teacherId: z.string(),
  keyWords: z.array(z.string()),
});

type CreatePost = z.infer<typeof createPostSchema>;

const updatePostSchema = z.object({
  title: z.string().optional(),
  text: z.string().optional(),
  keyWords: z.array(z.string()).optional(),
});

type UpdatePost = z.infer<typeof updatePostSchema>;

const getByTeacherSchema = z.object({
  teacherId: z.string(),
});

type GetByTeacher = z.infer<typeof getByTeacherSchema>;

@ApiTags('blog')
@UseInterceptors(LoggingInterceptor)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createPostSchema))
  @Post()
  async createPost(@Body() { title, text, keyWords, teacherId }: CreatePost) {
    await this.postsService.createPost({ title, text, keyWords, teacherId });
  }

  @Get()
  async getAllPosts(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.postsService.getAllPosts(page, limit);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/admin/:teacherId')
  async getAllPostsAdmin(
    @Param('teacherId') teacherId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.postsService.getAllPostsAdmin(teacherId, page, limit);
  }

  @Get('/search/:keyword')
  async getAllPostsByKeyword(
    @Param('keyword') keyword: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.postsService.getAllPostsByKeyword(keyword, page, limit);
  }

  @Get(':id')
  async getOnePost(@Param('id') id: string) {
    return await this.postsService.getOnePost(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  async updatePost(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePostSchema)) updateData: UpdatePost,
  ) {
    return await this.postsService.updatePost(id, updateData);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    await this.postsService.deletePost(id);
  }
}
