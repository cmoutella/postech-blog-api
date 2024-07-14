import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UsersController } from '../../modules/user/controllers/users.controller';
import { AppModule } from '../../app.module';
import { UsersModule } from '../../modules/user/user.module';
import { InterfaceUser } from '../../modules/user/schemas/models/user.interface';
import { UserService } from '../../modules/user/services/user.service';
import { UserRepository } from '../../modules/user/repositories/user.repository';
import { User } from '../../modules/user/schemas/user.schema';

//Model<UserDocument>
describe('User Controller', () => {
  let tModule: TestingModule;
  let userController: UsersController;
  let userService: UserService;
  let jwtService: JwtService;
  const jwtMockService = {
    sign: () => {},
  };
  const testUsedIds: string[] = [];

  const userOne = { username: 'marcoaurelio', password: 'teste' };
  const userTwo = { username: 'maria', password: 'teste' };
  const userWrong = { username: 'percivaldo' };

  beforeEach(async () => {
    tModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UserRepository,
          useValue: {
            createUser: jest.fn().mockResolvedValue(userOne),
            getAllUsers: jest.fn().mockResolvedValue([userOne, userTwo]),
            getById: jest.fn().mockResolvedValue([userOne]),
            getByUsername: jest.fn().mockResolvedValue(userOne),
            deleteUser: jest.fn().mockImplementation(),
          },
        },
        UserService,
      ],
      imports: [AppModule, UsersModule, User],
    }).compile();

    userController = tModule.get<UsersController>(UsersController);
    userService = tModule.get<UserService>(UserService);
    jwtService = tModule.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    console.log('AFTER EACH');
    console.log('testUsedIds', testUsedIds);

    testUsedIds.forEach(async (id) => {
      await userController.deleteUser(id);
    });
  });

  describe('POST create user', () => {
    it('should create user with success and return created user', async () => {
      const spyOnUsersService = jest.spyOn(userService, 'createUser');
      const response = await userController.createUser(userOne);

      if (response?.id) {
        testUsedIds.push(response.id.toString());
      }

      expect(spyOnUsersService).toHaveBeenCalled();
      expect(response.username).toBe(userOne.username);
    });

    it('should throw exception if username already in use', async () => {
      const createUserWithExitingUsername = async () => {
        await userController.createUser(userOne);
      };

      expect(createUserWithExitingUsername).rejects.toThrow();
    });

    it('should throw error if username or password missing object', async () => {
      const createWithWrongSchema = async () => {
        const u = await userController.createUser(
          userWrong as unknown as InterfaceUser,
        );

        if (u?.id) {
          testUsedIds.push(u.id.toString());
        }
      };
      expect(createWithWrongSchema).rejects.toThrow();
    });
  });

  describe.skip('GET getByUsername', () => {
    it('should return success if found', async () => {
      const newUser = { username: 'teste', password: 'teste' };
      await userController.createUser(newUser);
      const getUserResponse = await userController.getByUsername(
        newUser.username,
      );
      expect(getUserResponse).toBe({ username: newUser.username });
    });

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

  describe.skip('DELETE', () => {
    it('should call userService for deleteUser', async () => {
      const spyOnUsersService = jest.spyOn(userService, 'deleteUser');
      const u = await userController.createUser(userOne);

      if (u?.id) {
        testUsedIds.push(u.id);
      }

      const deleteResponse = await userController.deleteUser(u.id);

      expect(spyOnUsersService).toHaveBeenCalled();
    });

    // it('should throw Not Found it id not matched', async () => {
    //   const res = await userController.deleteUser(
    //     testUsedIds[testUsedIds.length - 1],
    //   );

    //   testUsedIds.pop();

    //   expect(res.message).toBe('Not found');
    //   expect(res.status).toBe(404);
    // });
  });
});
