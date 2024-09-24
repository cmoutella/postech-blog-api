import { InterfaceUser } from 'src/modules/user/schemas/models/user.interface';
import { InterfacePostsWithAuthor } from '../schemas/models/post.interface';

export const getPostsAuthorName = async (post, authorRepository) => {
  const author = (await authorRepository.getById(
    post.teacherId,
  )) as InterfaceUser;

  return {
    ...post,
    authorName: author.username,
  } as Partial<InterfacePostsWithAuthor>;
};
