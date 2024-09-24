import { InterfacePost } from '../schemas/models/post.interface';

export abstract class PostRepository {
  abstract getAllPosts(
    page?: number,
    limit?: number,
  ): Promise<Partial<InterfacePost>[]>;
  abstract getAllPostsAdmin(
    teacherId: string,
    page?: number,
    limit?: number,
  ): Promise<Partial<InterfacePost>[]>;
  abstract getAllPostsByKeyword(
    keyword: string,
    page?: number,
    limit?: number,
  ): Promise<Partial<InterfacePost>[]>;
  abstract getOnePost(id: string): Promise<Partial<InterfacePost>>;
  abstract createPost(newPost: InterfacePost): Promise<Partial<InterfacePost>>;
  abstract updatePost(id: string, data: Partial<InterfacePost>): Promise<void>;
  abstract deletePost(id: string): Promise<void>;
}
