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
  let testUsedIds: string[] = [];

  const userOne = { username: 'joao_teste', password: 'teste' };
  const userTwo = { username: 'maria_teste', password: 'teste' };
  const userWrong = { username: 'percivaldo_teste' };

  beforeAll(async () => {
    tModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UserRepository,
          useValue: {
            createUser: jest.fn().mockResolvedValue(userOne),
            getAllUsers: jest.fn().mockResolvedValue([userOne]),
            getById: jest.fn().mockResolvedValue([userOne]),
            getByUsername: jest.fn().mockResolvedValue(userOne),
            deleteUser: jest.fn().mockImplementation(),
          },
        },
        UserService,
      ],
      imports: [AppModule, UsersModule, User],
    }).compile();

    userController = await tModule.get<UsersController>(UsersController);
    userService = await tModule.get<UserService>(UserService);
    jwtService = await tModule.get<JwtService>(JwtService);
  });

  afterEach(async () => {
    if (testUsedIds.length > 0) {
      testUsedIds.forEach(async (id) => {
        await userController.deleteUser(id);
      });
    }
    testUsedIds = [];
  });

  afterAll(async () => {
    await tModule.close();
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
        await userController.createUser({
          username: 'admin',
          password: '1234',
        });
      };

      // 'Username already exists'
      expect(createUserWithExitingUsername).rejects.toThrow();
    });

    it('should throw error if username or password missing in object', async () => {
      const createWithWrongSchema = async () => {
        const u = await userController.createUser(
          userWrong as unknown as InterfaceUser,
        );

        if (u?.id) {
          testUsedIds.push(u.id.toString());
        }
      };

      //'Username or password missing'
      expect(createWithWrongSchema).rejects.toThrow();
    });
  });

  describe('AuthUser', () => {
    it('should return token if password is correct', async () => {
      const res = await userController.authUser({
        username: 'admin',
        password: 'admin',
      });

      expect(res).toHaveProperty('token');
    });

    it('should throw error if user not exist', async () => {
      const loginNonExistingUser = async () => {
        await userController.authUser({
          username: userWrong.username,
          password: '12345',
        });
      };

      expect(loginNonExistingUser).rejects.toThrow();
    });

    it('should throw error if password is wrong', async () => {
      const loginWithWrongPassword = async () => {
        await userController.authUser({
          username: userOne.username,
          password: '12345',
        });
      };

      // 'Username or password not matched'
      expect(loginWithWrongPassword).rejects.toThrow();
    });
  });

  describe('GET allUsers', () => {
    it('should call userService', async () => {
      const spyOnUsersService = jest.spyOn(userService, 'getAllUsers');
      await userController.getAllUsers();

      expect(spyOnUsersService).toHaveBeenCalled();
    });

    it('should return a list of created users', async () => {
      const usersList = await userController.getAllUsers();

      const userReturned = usersList.find((u) => u.username === 'admin');

      expect(userReturned).toBeTruthy();
    });
  });

  describe('GET getByUsername', () => {
    it('should return success if found', async () => {
      const getUserResponse = await userController.getByUsername('admin');
      expect(getUserResponse.username).toBe('admin');
    });

    it('should throw error if not found', async () => {
      const searchNonExistingUsername = async () => {
        await userController.getByUsername(userWrong.username);
      };
      expect(searchNonExistingUsername).rejects.toThrow();
    });
  });

  describe('DELETE', () => {
    it('should call userService for deleteUser', async () => {
      const u = await userController.createUser(userTwo);
      const spyOnUsersService = jest.spyOn(userService, 'deleteUser');
      await userController.deleteUser(u.id);

      expect(spyOnUsersService).toHaveBeenCalled();
    });

    it('should throw Not Found it id not matched', async () => {
      const deleteNonExistingUser = async () => {
        await userController.deleteUser('1');
      };

      expect(deleteNonExistingUser).rejects.toThrow();
    });
  });
});
