require('dotenv').config();
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert');
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');

let userAToken;
let userBToken;
let userAId;
let userBId;
let createdPostId;
let createdPostSlug;
let createdCommentId;

before(async () => {
  const mongoUri = process.env.MONGO_TEST_URI || 'mongodb://127.0.0.1:27017/blog_platform_test';
  await mongoose.connect(mongoUri);

  // Clean test db
  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});
});

after(async () => {
  await mongoose.connection.close();
});

describe('=== Full Blogging Platform API Test Suite ===', () => {
  // 1. AUTHENTICATION TESTS
  describe('1. Authentication Endpoints', () => {
    it('should register User A successfully and set HTTP-only cookie', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Alice Tester',
          email: 'alice@test.com',
          password: 'password123',
          bio: 'Frontend enthusiast',
        });

      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.user.id);
      assert.strictEqual(res.body.user.email, 'alice@test.com');
      assert.ok(res.body.token);
      assert.ok(res.headers['set-cookie']);

      userAToken = res.body.token;
      userAId = res.body.user.id;
    });

    it('should reject duplicate email registration', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Duplicate Alice',
          email: 'alice@test.com',
          password: 'password123',
        });

      assert.strictEqual(res.statusCode, 400);
      assert.strictEqual(res.body.success, false);
    });

    it('should register User B successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Bob Tester',
          email: 'bob@test.com',
          password: 'password123',
        });

      assert.strictEqual(res.statusCode, 201);
      userBToken = res.body.token;
      userBId = res.body.user.id;
    });

    it('should log in User A with valid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alice@test.com',
          password: 'password123',
        });

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.user.name, 'Alice Tester');
    });

    it('should reject login with wrong password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'alice@test.com',
          password: 'wrongpassword',
        });

      assert.strictEqual(res.statusCode, 401);
      assert.strictEqual(res.body.success, false);
    });

    it('should retrieve current user profile with GET /api/auth/me', async () => {
      const res = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${userAToken}`);

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.user.email, 'alice@test.com');
    });
  });

  // 2. BLOG POST CRUD AND OWNERSHIP TESTS
  describe('2. Blog Post Management', () => {
    it('should allow User A to create a published blog post', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          title: 'Introduction to Modern Web Design',
          content: 'Here is the detailed content for modern web design in 2026.',
          category: 'Design',
          tags: ['design', 'css', 'web'],
          status: 'published',
          coverImage: 'https://example.com/cover.jpg',
        });

      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.post.title, 'Introduction to Modern Web Design');
      assert.strictEqual(res.body.post.slug, 'introduction-to-modern-web-design');
      assert.strictEqual(res.body.post.status, 'published');

      createdPostId = res.body.post._id;
      createdPostSlug = res.body.post.slug;
    });

    it('should allow public retrieval of published posts with pagination and search', async () => {
      const res = await request(app)
        .get('/api/posts?category=Design&search=Modern')
        .send();

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.posts.length >= 1);
      assert.strictEqual(res.body.posts[0].slug, createdPostSlug);
    });

    it('should retrieve a single post by its slug', async () => {
      const res = await request(app)
        .get(`/api/posts/${createdPostSlug}`)
        .send();

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.post._id, createdPostId);
      assert.strictEqual(res.body.post.author.name, 'Alice Tester');
    });

    it('should forbid User B from updating User A’s post (ownership check)', async () => {
      const res = await request(app)
        .patch(`/api/posts/${createdPostId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({
          title: 'Hacked by Bob',
        });

      assert.strictEqual(res.statusCode, 403);
      assert.strictEqual(res.body.success, false);
    });

    it('should allow User A (owner) to update their post', async () => {
      const res = await request(app)
        .patch(`/api/posts/${createdPostId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          title: 'Introduction to Modern Web Design (Updated)',
          tags: ['design', 'modern'],
        });

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.post.title, 'Introduction to Modern Web Design (Updated)');
    });
  });

  // 3. COMMENT SYSTEM & MODERATION TESTS
  describe('3. Comment System & Moderation', () => {
    it('should allow User B to post a comment on User A’s post', async () => {
      const res = await request(app)
        .post(`/api/posts/${createdPostId}/comments`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({
          content: 'Fantastic article, Alice! Really learned a lot.',
        });

      assert.strictEqual(res.statusCode, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.comment.content, 'Fantastic article, Alice! Really learned a lot.');
      createdCommentId = res.body.comment._id;
    });

    it('should reject empty comment submission', async () => {
      const res = await request(app)
        .post(`/api/posts/${createdPostId}/comments`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({
          content: '',
        });

      assert.strictEqual(res.statusCode, 400);
    });

    it('should allow public retrieval of comments in chronological order', async () => {
      const res = await request(app)
        .get(`/api/posts/${createdPostId}/comments`)
        .send();

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.count, 1);
      assert.strictEqual(res.body.comments[0].author.name, 'Bob Tester');
    });

    it('should forbid User A from editing User B’s comment', async () => {
      const res = await request(app)
        .patch(`/api/comments/${createdCommentId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          content: 'Altered comment content',
        });

      assert.strictEqual(res.statusCode, 403);
    });

    it('should allow User B to edit their own comment', async () => {
      const res = await request(app)
        .patch(`/api/comments/${createdCommentId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({
          content: 'Fantastic article, Alice! Really learned a lot. (Edited)',
        });

      assert.strictEqual(res.statusCode, 200);
      assert.ok(res.body.comment.content.includes('(Edited)'));
    });

    it('should allow User A (Post Author) to moderate/delete User B’s comment on their post', async () => {
      const res = await request(app)
        .delete(`/api/comments/${createdCommentId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send();

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.message.includes('moderation'));
    });
  });

  // 4. USER PROFILE AND CLEANUP TESTS
  describe('4. User Profile & Post Deletion', () => {
    it('should allow User A to update their profile', async () => {
      const res = await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          bio: 'Updated bio: Lead UI/UX Architect.',
        });

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.user.bio, 'Updated bio: Lead UI/UX Architect.');
    });

    it('should retrieve User A public profile with authored posts', async () => {
      const res = await request(app)
        .get(`/api/users/${userAId}`)
        .send();

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.user.name, 'Alice Tester');
      assert.ok(res.body.postCount >= 1);
    });

    it('should forbid User B from deleting User A’s post', async () => {
      const res = await request(app)
        .delete(`/api/posts/${createdPostId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send();

      assert.strictEqual(res.statusCode, 403);
    });

    it('should allow User A (owner) to delete their post', async () => {
      const res = await request(app)
        .delete(`/api/posts/${createdPostId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send();

      assert.strictEqual(res.statusCode, 200);
      assert.strictEqual(res.body.success, true);
    });
  });
});
