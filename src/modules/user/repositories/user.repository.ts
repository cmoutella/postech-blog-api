import { InterfaceList } from 'src/modules/posts-collection/schemas/models/post.interface';
import {
  InterfaceUser,
  PublicInterfaceUser,
} from '../schemas/models/user.interface';

export abstract class UserRepository {
  abstract createUser(newUser: InterfaceUser): Promise<PublicInterfaceUser>;
  abstract getAllUsers(
    page?: number,
    limit?: number,
  ): Promise<InterfaceList<PublicInterfaceUser[]>>;
  abstract getById(id: string): Promise<PublicInterfaceUser>;
  abstract getByUsername(username: string): Promise<InterfaceUser>;
  abstract updateUser(
    id: string,
    data: Partial<InterfaceUser>,
  ): Promise<PublicInterfaceUser>;
  abstract updatePassword(
    id: string,
    data: { password: string },
  ): Promise<PublicInterfaceUser>;
  abstract deleteUser(id: string): Promise<void>;
}
