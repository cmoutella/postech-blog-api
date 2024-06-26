import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../controllers/users.controller';
import { UserService } from '../services/user.service';

describe('User Controller', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UserService],
    }).compile();

    controller = app.get<UsersController>(UsersController);
  });

  describe.skip('create: success', () => {
    it('should create user with success', () => {
      const newUser = { username: 'teste', password: 'teste' };
      expect(controller.createUser(newUser)).toBe([]);
    });
  });

  describe.skip('create: error', () => {
    it('should throw error if wrong object', () => {
      const newUser = { username: 'teste' };
      expect(controller.createUser(newUser)).toBe([]);
    });
  });

  describe.skip('getByUsername: success', () => {
    it('should return success if found', () => {
      expect(controller.getByUsername('jorge')).toBe([]);
    });
  });

  describe.skip('getByUsername: error', () => {
    it('should throw error if not found', () => {
      expect(controller.getByUsername('ulices')).toBe([]);
    });
  });
});
