import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRepository } from '../user.repository';
import { User, UserDocument } from '../../schemas/user.schema';
import {
  InterfaceUser,
  PublicInterfaceUser,
} from '../../schemas/models/user.interface';
import { DEFAULT_LIMIT } from 'src/shared/default/pagination';
import { InterfaceList } from 'src/modules/posts-collection/schemas/models/post.interface';

export class UserMongooseRepository implements UserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(newUser: InterfaceUser): Promise<PublicInterfaceUser> {
    const createUser = new this.userModel(newUser);
    const u = await createUser.save();

    return { id: u._id.toString(), username: u.username, name: u.name };
  }

  async getAllUsers(
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<InterfaceList<PublicInterfaceUser[]>> {
    const offset = (page - 1) * limit;

    const users = await this.userModel
      .find()
      .skip(offset)
      .limit(limit)
      .exec()
      .then((res) =>
        res.map((user) => {
          return {
            id: user._id.toString(),
            username: user.username,
            name: user.name,
          };
        }),
      );

    const totalPosts = await this.countUsers();

    return {
      data: users,
      totalItems: totalPosts,
      currentPage: page,
      itemsPerPage: limit,
    };
  }

  async getById(id: string): Promise<PublicInterfaceUser | null> {
    const user = await this.userModel.findOne({ _id: id }).exec();

    const userId = user._id.toString();

    const data = {
      username: user.username,
      name: user.username,
      id: userId,
    };

    return data;
  }

  async getByUsername(username: string): Promise<InterfaceUser | null> {
    const user = await this.userModel.findOne({ username }).exec();

    if (!user) return null;

    const userId = user._id.toString();

    const data = {
      username: user.username,
      name: user.name,
      password: user.password,
      id: userId,
    };

    return data;
  }

  async updateUser(
    id: string,
    data: InterfaceUser,
  ): Promise<PublicInterfaceUser> {
    const user = await this.userModel.findOne({ _id: id }).exec();

    if (!user) {
      return null;
    }

    await this.userModel
      .updateOne({ _id: id }, { ...user.toObject(), ...data })
      .exec();

    const userUpdated = await this.userModel.findOne({ _id: id }).exec();

    const updated = {
      username: userUpdated.username,
      name: userUpdated.name,
      id: userUpdated._id.toString(),
    };

    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    await this.userModel.deleteOne({ _id: id }).exec();
  }

  async countUsers(): Promise<number> {
    return await this.userModel.countDocuments().exec();
  }
}
