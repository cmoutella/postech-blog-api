import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsCollectionModule } from './posts-collection/posts-collection.module';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/blog-api'),
    PostsCollectionModule,
    JwtModule.register({
      global: true,
      secret: 'fiap',
      signOptions: { expiresIn: '5m' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
