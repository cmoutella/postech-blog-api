import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../user.repository';
import { User, UserDocument } from '../../schemas/user.schema';
import { InterfaceUser } from '../../schemas/models/user.interface';

export class UserMongooseRepository implements UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(newUser: InterfaceUser): Promise<void> {
    const createUser = new this.userModel(newUser);
    await createUser.save();
  }

  async getAllUsers(): Promise<InterfaceUser[]> {
    return await this.userModel.find().exec();
  }

  async getById(id: string): Promise<InterfaceUser> {
    return await this.userModel.findById({ _id: id }).exec();
  }

  async getByUsername(username: string): Promise<InterfaceUser | null> {
    return await this.userModel.findOne({ username }).exec();
  }

  async deleteUser(id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: id }).exec();
  }
}
