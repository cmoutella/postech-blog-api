import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';

import { UsersModule } from '../modules/user/user.module';
import { PostsCollectionModule } from '../modules/posts-collection/posts-collection.module';
import { LoggingInterceptor } from '../shared/interceptors/logging.interceptor';
import { AppModule } from '../app.module';
import { HttpExceptionFilter } from '../shared/filters/http-exception-filter';

describe('User Authentication', () => {
  let app: INestApplication;
  let server;
  const logInterceptor = { intercept: () => {} };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule, PostsCollectionModule],
    })
      .overrideInterceptor(LoggingInterceptor)
      .useValue(logInterceptor)
      .compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
    server = request(app.getHttpServer());
  });

  it('should create an user, login and create a new blog post', async () => {
    const newUser = { username: 'teste', password: 'teste' };
    const createResponse = await server.post('/users').send(newUser);
    expect(createResponse.statusCode).toBe(201);

    const loginResponse = await server.post('/users/login').send(newUser);
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');

    const newBlogPostResponse = await server
      .post('/post')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send({
        title: 'post teste',
        text: 'um teste',
        keyWords: ['teste'],
      });

    expect(newBlogPostResponse.statusCode).toBe(200);
  });
});
