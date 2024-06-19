import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsCollectionModule } from './posts-collection/posts-collection.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/blog-api'),
    PostsCollectionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
