import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { PostRepository } from './repositories/post.repository';
import { PostMongooseRepository } from './repositories/mongoose/post.mongoose.repository';
import { PostsService } from './services/posts-collection.service';
import { PostsController } from './controllers/posts-collection.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
  ],
  providers: [
    {
      provide: PostRepository,
      useClass: PostMongooseRepository,
    },
    PostsService,
  ],
  controllers: [PostsController],
})
export class PostsCollectionModule {}
