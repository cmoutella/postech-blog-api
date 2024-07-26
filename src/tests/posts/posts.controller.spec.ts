import { Test, TestingModule } from '@nestjs/testing';
import { PostsController } from '../../modules/posts-collection/controllers/posts-collection.controller';
//import { PostMongooseRepository } from '../../modules/posts-collection/repositories/mongoose/post.mongoose.repository';
import { PostRepository } from '../../modules/posts-collection/repositories/post.repository';
import { PostsService } from '../../modules/posts-collection/services/posts-collection.service';
import { AppModule } from '../../app.module';
import { PostsCollectionModule } from '../../modules/posts-collection/posts-collection.module';
import { Post } from '../../modules/posts-collection/schemas/post.schema';

describe('Post Controller', () => {
  let controller: PostsController;
  let postsService: PostsService;
  let tModule: TestingModule;
  let testPostsIds: string[] = [];

  const postOne = {
    title: 'test title',
    text: 'test text',
    keyword: ['test', 'keyword'],
  };

  beforeEach(async () => {
    tModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostRepository,
          useValue: {
            createPost: jest.fn().mockResolvedValue(postOne),
          },
        },
        PostsService,
      ],
      imports: [AppModule, PostsCollectionModule, Post],
    }).compile();

    controller = await tModule.get<PostsController>(PostsController);
  });

  afterAll(async () => {
    await tModule.close();
  });

  // Get All
  describe('getAllPosts', () => {
    it('should return a list of posts', async () => {
      const spyOnPostService = await controller.getAllPosts();
      expect(spyOnPostService.length > 0).toBeTruthy();
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
      ).toBe({});
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
          title: 'teste',
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
