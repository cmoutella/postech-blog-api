import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';

import request from 'supertest';

describe('User Authentication', () => {
  let controller: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    controller = app.get<AppController>(AppController);
  });

  it('should create an user, login and create a new blog post', async () => {
    const newUser = { username: 'teste', password: 'teste' };
    const createResponse = await request(controller)
      .post('/users')
      .send(newUser);
    expect(createResponse.statusCode).toBe(201);

    const loginResponse = await request(controller)
      .post('/users/login')
      .send(newUser);
    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');

    // como passar o token?
    const newBlogPostResponse = await request(controller)
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
