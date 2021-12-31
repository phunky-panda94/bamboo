const app = require('../../app');
const request = require('supertest')(app);
const database = require('../../util/memoryDatabase');

beforeAll(async () => { 
    await database.connect(); 
    await database.seed(); 
});

afterAll(async () => await database.disconnect());

describe('create post', () => {

    const User = require('../../src/user/user.model');
    const Post = require('../../src/post/post.model');
    const { createToken } = require('../../src/middleware/authenticator');
    const route = '/api/posts'
    let user;
    let token;

    beforeAll(async () => { 
        user = await User.findOne();
        token = createToken(JSON.stringify(user._id));
    });

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

})

describe('update post', () => {

})

describe('delete post', () => {

})