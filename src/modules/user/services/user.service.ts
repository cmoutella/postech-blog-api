import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { InterfaceUser } from '../schemas/models/user.interface';
import { User } from '../schemas/user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(user: InterfaceUser): Promise<void> {
    return await this.userRepository.createUser(user);
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.getAllUsers();
  }

  async getByUsername(username: string): Promise<User> {
    const user = await this.userRepository.getByUsername(username);

    if (!user) throw new NotFoundException();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await this.userRepository.getById(id);

    if (!user) throw new NotFoundException();

    await this.userRepository.deleteUser(id);
  }
}
