import { InterfaceUser } from '../schemas/models/user.interface';
import { User } from '../schemas/user.schema';

export abstract class UserRepository {
  abstract createUser(newUser: InterfaceUser): Promise<void>;
  abstract getAllUsers(): Promise<User[]>;
  abstract deleteUser(id: string): Promise<void>;
  abstract authUser(username: string, password: string): Promise<string>;
}
