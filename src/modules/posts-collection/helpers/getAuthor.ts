import {
  InterfacePost,
  InterfacePostsWithAuthor,
} from '../schemas/models/post.interface';

export const getPostsAuthorName = async (
  posts: Partial<InterfacePost>[],
  authorRepository,
) => {
  posts.map(async (post) => {
    const author = await authorRepository.getById(post.teacherId);

    return {
      ...post,
      authorName: author.username,
    } as Partial<InterfacePostsWithAuthor>;
  });

  return posts;
};
