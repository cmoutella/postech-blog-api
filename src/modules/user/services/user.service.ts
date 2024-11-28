import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import {
  InterfaceUser,
  PublicInterfaceUser,
} from '../schemas/models/user.interface';
import { InterfaceList } from 'src/modules/posts-collection/schemas/models/post.interface';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(user: InterfaceUser): Promise<PublicInterfaceUser> {
    if (!user.username) {
      throw new BadRequestException('Username missing');
    }
    if (!user.password) {
      throw new BadRequestException('Password missing');
    }
    if (!user.name) {
      throw new BadRequestException('Name missing');
    }

    const existingUser = await this.userRepository.getByUsername(user.username);

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    return await this.userRepository.createUser(user);
  }

  async getAllUsers(
    page?: number,
    limit?: number,
  ): Promise<InterfaceList<PublicInterfaceUser[]>> {
    return await this.userRepository.getAllUsers(page, limit);
  }

  async getByUsername(username: string): Promise<InterfaceUser> {
    const user = await this.userRepository.getByUsername(username);
    if (!user) throw new NotFoundException();
    return user;
  }

  async getById(id: string): Promise<PublicInterfaceUser> {
    const user = await this.userRepository.getById(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  async updateUser(
    id: string,
    data: Partial<InterfaceUser>,
  ): Promise<PublicInterfaceUser> {
    return await this.userRepository.updateUser(id, {
      ...data,
    });
  }

  async updatePassword(
    id: string,
    data: { password: string },
  ): Promise<PublicInterfaceUser> {
    return await this.userRepository.updatePassword(id, {
      ...data,
    });
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.getById(id);
    if (!user) throw new NotFoundException();
    await this.userRepository.deleteUser(id);
  }
}
