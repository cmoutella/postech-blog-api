import {
  InterfaceUser,
  PublicInterfaceUser,
} from '../schemas/models/user.interface';
import { User } from '../schemas/user.schema';

export abstract class UserRepository {
  abstract createUser(newUser: InterfaceUser): Promise<PublicInterfaceUser>;
  abstract getAllUsers(): Promise<PublicInterfaceUser[]>;
  abstract getById(username: string): Promise<User>;
  abstract getByUsername(username: string): Promise<InterfaceUser>;
  abstract deleteUser(id: string): Promise<void>;
}
