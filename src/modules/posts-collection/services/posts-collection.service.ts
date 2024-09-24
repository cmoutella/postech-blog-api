import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { InterfacePost } from '../schemas/models/post.interface';

@Injectable()
export class PostsService {
  constructor(private readonly postRepository: PostRepository) {}

  async createPost(newPost: InterfacePost): Promise<Partial<InterfacePost>> {
    const date = new Date().toISOString();

    return await this.postRepository.createPost({
      ...newPost,
      createdAt: date,
      updatedAt: date,
    });
  }

  async getAllPosts(
    page?: number,
    limit?: number,
  ): Promise<Partial<InterfacePost>[]> {
    return await this.postRepository.getAllPosts(page, limit);
  }

  async getAllPostsAdmin(
    teacherId: string,
    page?: number,
    limit?: number,
  ): Promise<Partial<InterfacePost>[]> {
    return await this.postRepository.getAllPostsAdmin(teacherId, page, limit);
  }

  async getAllPostsByKeyword(
    keyword: string,
    page?: number,
    limit?: number,
  ): Promise<Partial<InterfacePost>[]> {
    return await this.postRepository.getAllPostsByKeyword(keyword, page, limit);
  }

  async getOnePost(id: string): Promise<Partial<InterfacePost>> {
    const post = await this.postRepository.getOnePost(id);

    if (!post) throw new NotFoundException('Post não encontrado');
    return post;
  }

  async updatePost(id: string, data: Partial<InterfacePost>): Promise<void> {
    const date = new Date().toISOString();
    return await this.postRepository.updatePost(id, {
      ...data,
      updatedAt: date,
    });
  }

  async deletePost(id: string): Promise<void> {
    await this.postRepository.deletePost(id);
  }
}
