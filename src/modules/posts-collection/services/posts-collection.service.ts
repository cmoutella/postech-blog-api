import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import {
  InterfacePost,
  InterfacePostsWithAuthor,
} from '../schemas/models/post.interface';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { getPostsAuthorName } from '../helpers/getAuthor';

@Injectable()
export class PostsService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
  ) {}

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
  ): Promise<Partial<InterfacePostsWithAuthor>[]> {
    const posts = await this.postRepository.getAllPosts(page, limit);

    const postsWithAuthor = await getPostsAuthorName(
      posts,
      this.userRepository,
    );

    return postsWithAuthor;
  }

  async getAllPostsAdmin(
    teacherId: string,
    page?: number,
    limit?: number,
  ): Promise<Partial<InterfacePost>[]> {
    const posts = await this.postRepository.getAllPostsAdmin(
      teacherId,
      page,
      limit,
    );

    const postsWithAuthor = await getPostsAuthorName(
      posts,
      this.userRepository,
    );

    return postsWithAuthor;
  }

  async getAllPostsByKeyword(
    keyword: string,
    page?: number,
    limit?: number,
  ): Promise<Partial<InterfacePost>[]> {
    const posts = await this.postRepository.getAllPostsByKeyword(
      keyword,
      page,
      limit,
    );

    const postsWithAuthor = await getPostsAuthorName(
      posts,
      this.userRepository,
    );

    return postsWithAuthor;
  }

  async getOnePost(id: string): Promise<Partial<InterfacePost>> {
    const post = await this.postRepository.getOnePost(id);

    if (!post) throw new NotFoundException('Post não encontrado');

    const withAuthor = await getPostsAuthorName([post], this.userRepository);
    return withAuthor[0];
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
