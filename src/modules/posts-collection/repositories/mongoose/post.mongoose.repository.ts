import { InjectModel } from '@nestjs/mongoose';
import { PostRepository } from '../post.repository';
import { Model } from 'mongoose';
import { DEFAULT_LIMIT } from 'src/shared/default/pagination';
import { Post } from '../../schemas/post.schema';
import { InterfacePost } from '../../schemas/models/post.interface';

export class PostMongooseRepository implements PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async createPost(newPost: InterfacePost): Promise<void> {
    const createPost = new this.postModel(newPost);

    await createPost.save();
  }

  async getAllPosts(page = 1, limit = DEFAULT_LIMIT): Promise<InterfacePost[]> {
    const offset = (page - 1) * limit;

    return await this.postModel.find().skip(offset).limit(limit).exec();
  }

  async getAllPostsByKeyword(
    keyword: string,
    page = 1,
    limit = DEFAULT_LIMIT,
  ): Promise<InterfacePost[]> {
    const offset = (page - 1) * limit;

    // TODO
    return await this.postModel
      .find({ keyWords: keyword })
      .skip(offset)
      .limit(limit)
      .exec();
  }

  async getOnePost(id: string): Promise<InterfacePost> {
    return await this.postModel.findById(id).exec();
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
}
