import { UserRepository } from 'src/modules/user/repositories/user.repository';
import {
  InterfacePost,
  InterfacePostsWithAuthor,
} from '../schemas/models/post.interface';

export const getPostsAuthorName: (
  posts: Partial<InterfacePost>[],
  authorRepository: UserRepository,
) => Promise<Partial<InterfacePostsWithAuthor>[]> = async (
  posts,
  authorRepository,
) => {
  const withAuthorPromises = posts.map(async (post) => {
    const author = await authorRepository.getById(post.teacherId);

    return {
      ...post,
      authorName: author.username,
    } as Partial<InterfacePostsWithAuthor>;
  });

  const withAuthor = await Promise.all(withAuthorPromises);

  return withAuthor as Partial<InterfacePostsWithAuthor>[];
};
