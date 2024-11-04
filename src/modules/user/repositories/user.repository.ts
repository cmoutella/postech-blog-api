import {
  InterfaceUser,
  PublicInterfaceUser,
} from '../schemas/models/user.interface';
import { User } from '../schemas/user.schema';

export abstract class UserRepository {
  abstract createUser(newUser: InterfaceUser): Promise<PublicInterfaceUser>;
  abstract getAllUsers(): Promise<PublicInterfaceUser[]>;
  abstract getById(id: string): Promise<User>;
  abstract getByUsername(username: string): Promise<InterfaceUser>;
  abstract updateUser(
    id: string,
    data: Partial<InterfaceUser>,
  ): Promise<Omit<InterfaceUser, 'password'>>;
  abstract deleteUser(id: string): Promise<void>;
}
