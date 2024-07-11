import { InterfacePost } from '../schemas/models/post.interface';

export abstract class PostRepository {
  abstract getAllPosts(page?: number, limit?: number): Promise<InterfacePost[]>;
  abstract getAllPostsAdmin(
    page?: number,
    limit?: number,
  ): Promise<InterfacePost[]>;
  abstract getAllPostsByKeyword(
    keyword: string,
    page?: number,
    limit?: number,
  ): Promise<InterfacePost[]>;
  abstract getOnePost(id: string): Promise<InterfacePost>;
  abstract createPost(newPost: InterfacePost): Promise<void>;
  abstract updatePost(id: string, data: Partial<InterfacePost>): Promise<void>;
  abstract deletePost(id: string): Promise<void>;
}
