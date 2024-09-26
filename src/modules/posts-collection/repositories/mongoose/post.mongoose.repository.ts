/* eslint-disable @typescript-eslint/no-unused-vars */
import { InjectModel } from '@nestjs/mongoose';
import { PostRepository } from '../post.repository';
import { Model } from 'mongoose';
import { DEFAULT_LIMIT } from '../../../../shared/default/pagination';
import { Post } from '../../schemas/post.schema';
import {
  InterfaceList,
  InterfacePost,
} from '../../schemas/models/post.interface';

export class PostMongooseRepository implements PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(newPost: InterfacePost): Promise<Partial<InterfacePost>> {
    const createPost = new this.postModel(newPost);

    await createPost.save();

    const { createdAt, updatedAt, _id: id, ...rest } = createPost.toObject();

    return { id: id.toString(), ...rest };
  }

  async getAllPosts(
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<InterfaceList<Partial<InterfacePost>[]>> {
    const offset = (page - 1) * limit;

    const results = await this.postModel
      .find()
      .skip(offset)
      .limit(limit)
      .exec();

    const posts = results.map((res) => {
      const { updatedAt, createdAt, _id, ...post } = res.toObject();
      return { ...post, createdAt, id: _id.toString() };
    });

    const totalPosts = await this.countPosts();

    return {
      data: posts,
      totalItems: totalPosts,
      currentPage: page,
      itemsPerPage: limit,
    };
  }

  async getAllPostsAdmin(
    teacherId,
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<InterfaceList<Partial<InterfacePost>[]>> {
    const offset = (page - 1) * limit;

    const results = await this.postModel
      .find({ teacherId: teacherId })
      .skip(offset)
      .limit(limit)
      .exec();

    const posts = results.map((res) => {
      const { _id: id, ...post } = res.toObject();
      return { ...post, id: id.toString() };
    });

    const totalPosts = await this.countPosts();

    return {
      data: posts,
      totalItems: totalPosts,
      currentPage: page,
      itemsPerPage: limit,
    };
  }

  async getAllPostsByKeyword(
    keyword: string,
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<InterfaceList<Partial<InterfacePost>[]>> {
    const offset = (page - 1) * limit;

    const results = await this.postModel
      .find({ keyWords: keyword })
      .skip(offset)
      .limit(limit)
      .exec();

    const posts = results.map((res) => {
      const { createdAt, updatedAt, _id: id, ...post } = res.toObject();
      return { ...post, id: id.toString() };
    });

    const totalPosts = await this.countPosts();

    return {
      data: posts,
      totalItems: totalPosts,
      currentPage: page,
      itemsPerPage: limit,
    };
  }

  async getOnePost(id: string): Promise<Partial<InterfacePost>> {
    const { _id, updatedAt, ...result } = await this.postModel
      .findById(id)
      .exec()
      .then((res) => res.toObject());

    return { id: _id.toString(), ...result };
  }

  async updatePost(id: string, data: Partial<InterfacePost>): Promise<void> {
    const foundPost = this.postModel.findById(id).exec();

    if (!foundPost) {
      return null;
    }

    await this.postModel
      .updateOne({ _id: id }, { ...foundPost, ...data })
      .exec();
  }

  async deletePost(id: string): Promise<void> {
    await this.postModel.deleteOne({ _id: id }).exec();
  }

  async countPosts(): Promise<number> {
    return await this.postModel.countDocuments().exec();
  }
}
