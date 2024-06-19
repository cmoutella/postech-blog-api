import { Injectable } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { InterfacePost } from '../schemas/models/post.interface';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(newPost: InterfacePost): Promise<void> {
    return this.postRepository.createPost(newPost);
  }

  async getAllPosts(page?: number, limit?: number): Promise<InterfacePost[]> {
    return this.postRepository.getAllPosts(page, limit);
  }

  async getAllPostsByKeyword(
    keyword: string,
    page?: number,
    limit?: number,
  ): Promise<InterfacePost[]> {
    return this.postRepository.getAllPostsByKeyword(keyword, page, limit);
  }

  async getOnePost(id: string): Promise<InterfacePost> {
    return this.postRepository.getOnePost(id);
  }

  async updatePost(id: string, data: Partial<InterfacePost>): Promise<void> {
    return this.postRepository.updatePost(id, data);
  }

  async deletePost(id: string): Promise<void> {
    await this.postRepository.deletePost(id);
  }
}
