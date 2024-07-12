import { JwtService } from '@nestjs/jwt';
import { UsersController } from '../modules/user/controllers/users.controller';
import { UserService } from '../modules/user/services/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from '../modules/user/user.module';
import { AppModule } from '../app.module';

describe('User Controller', () => {
  let userController: UsersController;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const modT: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      imports: [AppModule, UsersModule],
    }).compile();

    userController = modT.get<UsersController>(UsersController);
    userService = modT.get<UserService>(UserService);
    jwtService = modT.get<JwtService>(JwtService);
  });

  // describe.skip('create: success', () => {
  //   it('should create user with success and return created user', async () => {
  //     const newUser = { username: 'teste', password: 'teste' };
  //     const response = await userController.createUser(newUser);
  //     expect(response.status).toBe(200);
  //   });
  // });

  // describe.skip('create: error', () => {
  //   it('should throw error if wrong object', async () => {
  //     const newUser = { username: 'teste' };
  //     const response = await userController.createUser(newUser);
  //     expect(response.statusCode).toBe(401);
  //     expect(response.body.message).toBe({
  //       message: 'Username or password missing',
  //     });
  //   });
  // });

  describe('getByUsername: success', () => {
    it('should return success if found', async () => {
      const newUser = { username: 'teste', password: 'teste' };
      await userController.createUser(newUser);
      const getUserResponse = await userController.getByUsername(
        newUser.username,
      );
      expect(getUserResponse).toBe({ username: newUser.username });
    });
  });

  describe('getByUsername: error', () => {
    it('should throw error if not found', async () => {
      const newUser = { username: 'teste', password: 'teste' };
      await userController.createUser(newUser);
      const getUserResponse = await userController.getByUsername('jorge');
      console.log('# getByUsername error');
      console.log(getUserResponse);
      console.log('-----');
      expect(getUserResponse).toBe({ message: 'Not found' });
    });
  });

  describe('delete: success', () => {
    it('should delete user with success', async () => {
      const newUser = { username: 'teste', password: 'teste' };
      await userController.createUser(newUser);
      const user = await userController.getByUsername(newUser.username);
      const deleteResponse = await userController.deleteUser(user.id);
      console.log('# delete success');
      console.log(deleteResponse);
      console.log('-----');
      expect(deleteResponse).toBe(200);
    });
  });
});
