import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../user.repository';
import { User, UserDocument } from '../../schemas/user.schema';
import {
  InterfaceUser,
  PublicInterfaceUser,
} from '../../schemas/models/user.interface';

export class UserMongooseRepository implements UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(newUser: InterfaceUser): Promise<PublicInterfaceUser> {
    const createUser = new this.userModel(newUser);
    const u = await createUser.save();

    return { id: u._id.toString(), username: u.username };
  }

  async getAllUsers(): Promise<PublicInterfaceUser[]> {
    const list = await this.userModel.find().exec();
    return list.map((u) => {
      return { username: u.username, id: u._id.toString() };
    });
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
