import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongoDBContainer } from '@testcontainers/mongodb';

import { UsersModule } from '../modules/user/user.module';
import { PostsCollectionModule } from '../modules/posts-collection/posts-collection.module';
import { LoggingInterceptor } from '../shared/interceptors/logging.interceptor';
import { AppModule } from '../app.module';
import { HttpExceptionFilter } from '../shared/filters/http-exception-filter';

describe('User Authentication', () => {
  let app: INestApplication;
  let server;
  const logInterceptor = { intercept: () => {} };
  let mongodbContainer: MongoDBContainer;

  beforeAll(async () => {
    const tModule: TestingModule = await Test.createTestingModule({
      imports: [AppModule, UsersModule, PostsCollectionModule],
    })
      .overrideInterceptor(LoggingInterceptor)
      .useValue(logInterceptor)
      .compile();

    // https://www.google.com/search?q=how+to+use+my+docker+for+my+integration+test+javascript&oq=how+to+use+my+docker+for+my+integration+test+javasc&gs_lcrp=EgZjaHJvbWUqBwgBECEYoAEyBggAEEUYOTIHCAEQIRigATIHCAIQIRigAdIBCTE5MDI5ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8#fpstate=ive&vld=cid:997401a4,vid:eRPkNd40n94,st:141
    //
    // const network = await new Network(new RandomUuid()).start();

    // const mongoContainer = await new GenericContainer('mongo:latest')
    //   .withName('blog_api:test')
    //   .withExposedPorts(3000)
    //   .withEnvironment({ ENV: 'MONGO_URI' })
    //   .withEnvironment({ ENV: 'JWT_SECRET' })
    //   .withNetwork(network)
    //   .start();

    mongodbContainer = await new MongoDBContainer();
    mongodbContainer.start();

    app = tModule.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
    server = request(app.getHttpServer());
  });

  afterAll(async () => {
    await app.close;
  });

  it('should create an user, login and create a new blog post', async () => {
    const newUser = { username: 'maria_teste', password: 'teste' };

    const createRes = await server.post('/users').send(newUser);
    expect(createRes).toHaveProperty('username');

    const loginResponse = await server.post('/users/login').send(newUser);
    expect(loginResponse).toHaveProperty('token');

    const testPost = {
      title: 'post teste',
      text: 'um teste',
      keyWords: ['teste'],
    };

    await server
      .post('/post')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(testPost);

    const found = server.get(`/post/search/${testPost.keyWords[0]}`);

    expect(found.title).toBe(testPost.title);
  });
});
