import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './schemas/post.schema';
import { PostRepository } from './repositories/post.repository';
import { PostMongooseRepository } from './repositories/mongoose/post.mongoose.repository';
import { PostsService } from './services/posts-collection.service';
import { PostsController } from './controllers/posts-collection.controller';
import { UserRepository } from '../user/repositories/user.repository';
import { UserMongooseRepository } from '../user/repositories/mongoose/user.mongoose.repository';
import { User, UserSchema } from '../user/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [
    {
      provide: PostRepository,
      useClass: PostMongooseRepository,
    },
    {
      provide: UserRepository,
      useClass: UserMongooseRepository,
    },
    PostsService,
  ],
  controllers: [PostsController],
})
export class PostsCollectionModule {}
