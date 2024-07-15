import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from 'src/modules/posts-collection/controllers/posts-collection.controller';
import { PostMongooseRepository } from 'src/modules/posts-collection/repositories/mongoose/post.mongoose.repository';
import { PostRepository } from 'src/modules/posts-collection/repositories/post.repository';
import { PostsService } from 'src/modules/posts-collection/services/posts-collection.service';

describe('Post Controller', () => {
  let controller: PostsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostRepository,
          useClass: PostMongooseRepository,
        },
        PostsService,
      ],
    }).compile();

    controller = app.get<PostsController>(PostsController);
  });

  // Get All
  describe.skip('getAllPosts', () => {
    it('should return a list of posts', () => {
      expect(controller.getAllPosts()).toBe([]);
    });
  });

  // Get One
  describe.skip('getOnePost', () => {
    it('should return the searcherd post', () => {
      const id = '';
      expect(controller.getOnePost(id)).toBe({});
    });
  });

  // Get by Keyword
  describe.skip('getAllPostsByKeyword', () => {
    it('should return all posts with the keyword', () => {
      expect(controller.getAllPostsByKeyword('keyword')).toBe({});
    });
  });

  // Create
  describe.skip('createPost with success', () => {
    it('should return status 200 on creating a post with correct schema', () => {
      expect(
        controller.createPost({
          title: 'teste',
          text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam at enim ad minim kontem proverb',
          keyWords: ['key', 'word'],
        }),
      ).toBe([]);
    });
  });

  describe.skip('createPost failed', () => {
    it('should return status ? on creating a post with incorrect schema', () => {
      expect(
        controller.createPost({
          title: 'teste',
          keyWords: ['key', 'word'],
        }),
      ).toBe([]);
    });
  });

  // Update
  describe.skip('updatePost success', () => {
    it('should return status 200 on updating a post with correct schema', () => {
      const id = '';

      expect(
        controller.updatePost(id, {
          title: 'teste update',
        }),
      ).toBe([]);
    });
  });

  describe.skip('updatePost failed', () => {
    it('should return status ? on updating a post with incorrect schema', () => {
      const id = '';

      expect(
        controller.updatePost(id, {
          name: 'teste',
        }),
      ).toBe([]);
    });
  });

  // Delete

  describe.skip('delete success', () => {
    it('should return status 200 on deleting a post', () => {
      const id = '';

      expect(controller.deletePost(id)).toBe([]);
    });
  });

  describe.skip('delete failed', () => {
    it('should return status ? on deleting a non existing post', () => {
      const id = '';

      expect(controller.deletePost(id)).toBe([]);
    });
  });
});
