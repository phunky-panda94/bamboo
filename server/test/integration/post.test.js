const app = require('../../app');
const request = require('supertest')(app);
const database = require('../../util/memoryDatabase');

const User = require('../../src/user/user.model');
const Post = require('../../src/post/post.model');
const { createToken } = require('../../src/middleware/authenticator');
let user;
let token;
let post;

beforeAll(async () => { 
    await database.connect(); 
    await database.seed(); 
    user = await User.findOne();
    token = createToken(JSON.stringify(user._id));
    post = await Post.findOne();
});

afterAll(async () => await database.disconnect());

describe('create post', () => {

    const route = '/api/posts'

    it('POST request to /api/posts creates new post in database and returns status 201 id of new post', async () => {

        const newPost = { content: 'this is a new post' }

        const response = await request.post(route)
            .set('Authorization', `Bearer ${token}`)
            .send(newPost);

        expect(response.status).toBe(201);
        expect(response.body.post).toBeTruthy();

        const savedPost = await Post.findById(response.body.post);
        expect(savedPost).toBeTruthy();
        expect(savedPost.content).toBe('this is a new post');

    })

    it('POST request to /api/posts returns 400 and error message if post could not be created', async () => {

        const newPost = { content: '' }
        const response = await request.post(route)
            .set('Authorization', `Bearer ${token}`)
            .send(newPost);

        expect(response.status).toBe(400);
        expect(response.body.error).toBeTruthy();
        expect(response.body.error).toBe('post could not be created');

    })

})

describe('get post', () => {

    const Post = require('../../src/post/post.model');

    it('GET request to /api/posts returns all posts in response body and status 200', async () => {

        const response = await request.get('/api/posts');
        
        expect(response.status).toBe(200);
        expect(response.body.posts).toBeTruthy();
        expect(response.body.posts[0].content).toBe('this is a post');

    })

    it('GET request to /api/posts/:id returns post and status 200', async () => {

        const response = await request.get(post.url);

        expect(response.status).toBe(200);
        expect(response.body).toBeTruthy();
        expect(response.body.content).toBe('this is a post');

    })

    it('GET request to /api/posts/:id returns 404 and post not found message if post does not exist', async () => {

        const response = await request.get('/api/posts/123');

        expect(response.status).toBe(404);
        expect(response.body.error).toBeTruthy();
        expect(response.body.error).toBe('post not found');

    })

})

describe.only('update post', () => {

    const Post = require('../../src/post/post.model');

    it('PUT request to /api/posts/:id updates post in database and returns status 204', async () => {

        const response = await request.put(post.url)
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'this is an updated post' });

        expect(response.status).toBe(204);

        const updatedPost = await Post.findOne();
        expect(updatedPost.content).toBe('this is an updated post');

    })

    it('PUT request to /api/posts/:id returns 401 and unauthorized if invalid token provided', async () => {

        const response = await request.put(post.url)
            .set('Authorization', 'Bearer abc')
            .send({ content: 'this is an updated post' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('unauthorized');

    })

    it('PUT request to /api/posts/:id returns 404 and error message if post does not exist', async () => {

        const response = await request.put('/api/posts/123')
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'this is an updated post' });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('post does not exist');

    })

    it('PUT request to /api/posts/:id return 400 and error message if post could not be updated', async () => {

        const response = await request.put(post.url)
            .set('Authorization', `Bearer ${token}`)
            .send({ content: '' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('post could not be updated');

    })

})

describe('delete post', () => {

})