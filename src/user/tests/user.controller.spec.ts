import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../controllers/users.controller';
import { UserService } from '../services/user.service';

describe('Post Controller', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UserService],
    }).compile();

    controller = app.get<UsersController>(UsersController);
  });

  // describe.skip('login', () => {
  //   it('should return auth token', () => {
  //     expect(controller.login()).toBe([]);
  //   });
  // });
});
