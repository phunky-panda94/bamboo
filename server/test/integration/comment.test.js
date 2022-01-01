const app = require('../../app');
const request = require('supertest')(app);

const database = require('../../util/memoryDatabase');

const User = require('../../src/user/user.model');
const Post = require('../../src/post/post.model');
const Comment = require('../../src/comment/comment.model');
const { createToken } = require('../../src/middleware/authenticator');

let user;
let token;
let post;
let comment;

beforeAll(async () => { 
    await database.connect();
    await database.seed();
    user = await User.findOne();
    token = createToken(user._id.toString());
    post = await Post.findOne();
    comment = await Comment.findOne();
});

afterAll(async () => database.disconnect());

describe('create comment', () => {

    it('POST request to /api/posts/:postId/comments to create new comment in database and return status 201', async () => {
        
        const response = await request.post(`${post.url}/comments/`)
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'this is a new comment' });

        expect(response.status).toBe(201);
        expect(response.body.id).toBeTruthy();

        const newComment = await Comment.findById(response.body.id);

        expect(newComment).toBeTruthy();
        expect(newComment.content).toBe('this is a new comment');

    })

    it('POST request to /api/posts/:postId/comments returns 401 and unauthorized if invalid token', async () => {

        const response = await request.post(`${post.url}/comments`)
            .set('Authorization', 'Bearer abc')
            .send({ content: 'this is a new comment' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('unauthorized');

    })

    it('POST request to /api/posts/:id/comments returns 401 and error message if no token', async () => {

        const response = await request.post(`${post.url}/comments`)
            .send({ content: 'this is a new comment' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('no token in Authorization header');

    })

    it('POST request to /api/posts/:id/comments returns 400 and error message if comment could not be created', async () => {

        const response = await request.post('/api/posts/123/comments')
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'this is a new comment' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('comment could not be created');

    })

})

describe('get comment', () => {

    describe('a comment', () => {

    })

    describe('post comments', () => {
        
    })

})

describe('update comment', () => {

})

describe('delete comment', () => {

})