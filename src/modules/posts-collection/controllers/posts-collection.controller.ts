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
  UsePipes,
} from '@nestjs/common';
import { InterfacePost } from '../schemas/models/post.interface';
import { PostsService } from '../services/posts-collection.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';
import { z } from 'zod';
import { ZodValidationPipe } from 'src/shared/pipe/zod-validation.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

const createPostSchema = z.object({
  title: z.string(),
  text: z.string(),
  keyWords: z.array(z.string()),
});

type CreatePost = z.infer<typeof createPostSchema>;

@ApiTags('blog')
@UseInterceptors(LoggingInterceptor)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ZodValidationPipe(createPostSchema))
  @Post()
  async createPost(@Body() { title, text, keyWords }: CreatePost) {
    await this.postsService.createPost({ title, text, keyWords });
  }

  @Get()
  async getAllPosts(page?: number, limit?: number) {
    return await this.postsService.getAllPosts(page, limit);
  }

  @Get('/keyword/:keyword')
  async getAllPostsByKeyword(@Param('keyword') keyword: string) {
    return await this.postsService.getAllPostsByKeyword(keyword);
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
    @Body() data: Partial<InterfacePost>,
  ) {
    return await this.postsService.updatePost(id, data);
  }
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deletePost(@Param('id') id: string) {
    await this.postsService.deletePost(id);
  }
}
