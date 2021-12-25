const Post = require('../src/post/post.model');
const User = require('../src/user/user.model');
const controller = require('../src/post/post.controller');
const { ObjectId } = require('mongoose');

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

    })

    it('get should return the post from the database and return status 200', async () => {
    
        const req = mockRequest({
            post: existingPost._id
        })

        const res = mockResponse();

        await controller.get(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(existingPost);

    })

    it('get should return 404 if post not found in database', async () => {

        const req = mockRequest({
            post: '1234'
        })

        const res = mockResponse();

        await controller.get(req, res);

        expect(res.status).toHaveBeenCalledWith(404);

    })

    it('update should update the post in datebase and return status 204', async () => {

        
        const updatedContent = "I'm Batman";
        
        const req = mockRequest({
            post: existingPost._id,
            updatedContent: updatedContent
        });

        const res = mockResponse();

        await controller.update(req, res);

        expect(res.status).toHaveBeenCalledWith(204);

        const updatedPost = Post.findOne({ author: user._id, content: updatedContent });

        expect(updatedPost).toBeTruthy();

    })

    it('delete should remove the post from the database and return status 202', async () => {

    })

})