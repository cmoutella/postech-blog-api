import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PostsCollectionModule } from './modules/posts-collection/posts-collection.module';
import { UsersModule } from './modules/user/user.module';
import { StudentModule } from './modules/student/student.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    StudentModule,
    PostsCollectionModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '15m' },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
