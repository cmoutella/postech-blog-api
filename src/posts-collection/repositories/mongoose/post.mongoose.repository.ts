import { InjectModel } from '@nestjs/mongoose';
import { PostRepository } from '../post.repository';
import { InterfacePost } from 'src/posts-collection/schemas/models/post.interface';
import { Post } from 'src/posts-collection/schemas/post.schema';
import { Model } from 'mongoose';
import { DEFAULT_LIMIT } from 'src/shared/default/pagination';

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
