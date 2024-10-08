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

  async getAllUsers(): Promise<Omit<InterfaceUser, 'password'>[]> {
    const users = await this.userModel
      .find()
      .exec()
      .then((res) =>
        res.map((user) => {
          return { id: user._id.toString(), username: user.username };
        }),
      );

    return users;
  }

  async getById(id: string): Promise<InterfaceUser | null> {
    const user = await this.userModel.findById({ _id: id }).exec();

    const userId = user._id.toString();

    const data = {
      username: user.username,
      password: user.password,
      id: userId,
    };

    return data;
  }

  async getByUsername(username: string): Promise<InterfaceUser | null> {
    const user = await this.userModel.findOne({ username }).exec();

    const userId = user._id.toString();

    const data = {
      username: user.username,
      password: user.password,
      id: userId,
    };

    return data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: id }).exec();
  }
}
