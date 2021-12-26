const Post = require('../src/post/post.model');
const User = require('../src/user/user.model');
const controller = require('../src/post/post.controller');

const app = require('../app');
const request = require('supertest')(app);

// mocks
const mockRequest = (body) => {
    return {
        body: body
    }
}

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res),
    res.json = jest.fn().mockReturnValue(res)
    return res;
}

// setup
const database = require('../util/memoryDatabase');

let user;
let existingPost;

beforeAll(async () => { 
    await database.connect();
    await database.seed();
    user = await User.findOne({ email: 'bwayne@wayne.com' });
    existingPost = await Post.findOne({ author: user._id, content: 'this is a placeholder' });
});

afterAll(async() => await database.disconnect());

describe('post model', () => {

    it('should return validation error if author empty', () => {
        const post = new Post();

        post.validate(err => {
            expect(err.errors.author).toBeTruthy();
        })
    })

    it('should return validation error if content empty', () => {
        const post = new Post();

        post.validate(err => {
            expect(err.errors.content).toBeTruthy();
        })
    })

})

describe('post controllers', () => {

    it('create should add post to database and return status 201 and post id', async () => {
        
        const content = "I'm Batman";

        const req = mockRequest({
            user: user._id,
            content: content
        })

        const res = mockResponse();

        await controller.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ post: expect.anything() });

    })

    it('create should return 400 if error when saving post', async () => {

        const req = mockRequest({
            user: '',
            content: ''
        })

        const res = mockResponse();

        await controller.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'post could not be created' })

    })

    it('get should return the post from the database and return status 200', async () => {
    
        const req = {
            params: { post: existingPost._id }
        }

        const res = mockResponse();

        await controller.get(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(existingPost);

    })

    it('get should return 404 if post not found in database', async () => {

        const req = {
            params: { post: '1234' }
        }

        const res = mockResponse();

        await controller.get(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'post not found' })

    })

    it('getAll should return all posts from database and status 200', async () => {

        const req = mockRequest({})
        const res = mockResponse();

        await controller.getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ posts: expect.anything() });

    });

    it('update should update the post in datebase and return status 204', async () => {

        const updatedContent = "I'm Batman";
        
        const req = {
            params: { post: existingPost._id },
            body: { content: updatedContent }
        };

        const res = mockResponse();

        await controller.update(req, res);

        expect(res.status).toHaveBeenCalledWith(204);

        const updatedPost = Post.findOne({ author: user._id, content: updatedContent });

        expect(updatedPost).toBeTruthy();

    })

    it('update should return 400 if error updating the post', async () => {

        const req = {
            params: { post: 'abcd' },
            body: { content: '' }
        };

        const res = mockResponse();

        await controller.update(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'post could not be updated' })

    })

    it('delete should remove the post from the database and return status 202', async () => {

        const req = {
            params: { post: existingPost._id }
        }

        const res = mockResponse();

        await controller.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(202);

    })

    it('delete should return 400 if error deleting the post', async () => {

        const req = {
            params: { post: 'abcd' }
        }

        const res = mockResponse();

        await controller.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'post does not exist' })

    })

})

describe('post routes', () => {

    it.only('POST request to create post authenticates token and calls create method of post controller', async () => {

        const response = await request
            .post('/api/posts/')

        expect(response.statusCode).toBe(201);

    })

    it('GET request for all posts calls getAll method of post controller', () => {

    })

    it('GET request for a post calls get method of post controller', () => {

    })

    it('PUT request for a post calls put method of post controller', () => {

    })

    it('DELETE request for a post calls delete methof of post controller', () => {

    })

})