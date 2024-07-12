import { JwtService } from '@nestjs/jwt';
import { UsersController } from 'src/modules/user/controllers/users.controller';
import { UserService } from 'src/modules/user/services/user.service';

describe('User Controller', () => {
  let userController: UsersController;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    userController = new UsersController(userService, jwtService);
  });

  describe.skip('create: success', () => {
    it('should create user with success and return created user', async () => {
      const newUser = { username: 'teste', password: 'teste' };
      const response = await userController.createUser(newUser);
      expect(response.statusCode).toBe(200);
      expect(response.body.data).toBe({ username: newUser.username });
    });
  });

  describe.skip('create: error', () => {
    it('should throw error if wrong object', async () => {
      const newUser = { username: 'teste' };
      const response = await userController.createUser(newUser);
      expect(response.statusCode).toBe(401);
      expect(response.body).toBe({ message: 'Username or password missing' });
    });
  });

  describe.skip('getByUsername: success', () => {
    it('should return success if found', async () => {
      const newUser = { username: 'teste', password: 'teste' };
      await userController.createUser(newUser);
      const getUserResponse = await userController.getByUsername(
        newUser.username,
      );
      expect(getUserResponse.statusCode).toBe(200);
      expect(getUserResponse.body.data).toBe({ username: newUser.username });
    });
  });

  describe.skip('getByUsername: error', () => {
    it('should throw error if not found', async () => {
      const newUser = { username: 'teste', password: 'teste' };
      await userController.createUser(newUser);
      const getUserResponse = await userController.getByUsername('jorge');
      expect(getUserResponse.statusCode).toBe(404);
    });
  });

  describe.skip('delete: success', () => {
    it('should delete user with success', async () => {
      const newUser = { username: 'teste', password: 'teste' };
      const createResponse = await userController.createUser(newUser);
      const deleteResponse = await userController.deleteUser(
        createResponse.body.data.id,
      );
      expect(deleteResponse.statusCode).toBe(200);
    });
  });
});
