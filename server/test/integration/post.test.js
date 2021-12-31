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
    const route = '/api/post'
    let user;

    beforeAll(async () => { user = await User.findOne() });

    it('POST request to /api/post creates new post in database and returns status 201 id of new post', async () => {

        const newPost = {
            author: user._id,
            content: 'this is a new post'
        }

        const response = await request.post(route)
            .set('Authorization', `Bearer ${token}`)
            .send(newPost);

        expect(response.status).toBe(201);
        expect(response.body.post).toBeTruthy();

    })

})

describe('get post', () => {

})

describe('update post', () => {

})

describe('delete post', () => {

})