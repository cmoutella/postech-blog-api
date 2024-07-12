import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from 'src/modules/user/controllers/users.controller';
import { UserService } from 'src/modules/user/services/user.service';

import request from 'supertest';

describe('User Controller', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const AppModule: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UserService],
    }).compile();

    controller = AppModule.get<UsersController>(UsersController);
  });

  describe.skip('create: success', () => {
    it('should create user with success and return created user', async () => {
      const newUser = { username: 'teste', password: 'teste' };
      const response = await request(controller).post('/users').send(newUser);
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toBe({ username: newUser.username });
    });
  });

  describe.skip('create: error', () => {
    it('should throw error if wrong object', async () => {
      const newUser = { username: 'teste' };
      const response = await request(controller).post('/users').send(newUser);
      expect(response.statusCode).toBe(401);
      expect(response.body).toBe({ message: 'Username or password missing' });
    });
  });

  describe.skip('getByUsername: success', () => {
    it('should return success if found', async () => {
      const newUser = { username: 'teste', password: 'teste' };
      await request(controller).post('/users').send(newUser);
      const getUserResponse = await request(controller).post(
        `/users/${newUser.username}`,
      );
      expect(getUserResponse.statusCode).toBe(200);
      expect(getUserResponse.body.data).toBe({ username: newUser.username });
    });
  });

  describe.skip('getByUsername: error', () => {
    it('should throw error if not found', async () => {
      const newUser = { username: 'teste', password: 'teste' };
      await request(controller).post('/users').send(newUser);
      const getUserResponse = await request(controller).post(`/users/jorge`);
      expect(getUserResponse.statusCode).toBe(404);
    });
  });

  describe.skip('delete: success', () => {
    it('should delete user with success', async () => {
      const newUser = { username: 'teste', password: 'teste' };
      const createResponse = await request(controller)
        .post('/users')
        .send(newUser);
      const deleteResponse = await request(controller)
        .delete(`/users/${createResponse.data.id}`)
        .send(newUser);
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});
