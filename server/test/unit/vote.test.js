const database = require('../../util/memoryDatabase');

const User = require('../../src/user/user.model');
const Post = require('../../src/post/post.model');
const Comment = require('../../src/comment/comment.model');
const Vote = require('../../src/vote/vote.model');

let user;
let post;
let comment;
let vote;

beforeAll(async () => { 
    await database.connect();
    await database.seed();
    user = await User.findOne({ email: 'bwayne@wayne.com' });
    post = await Post.findOne({ content: 'this is another post' });
    postB = await Post.findOne({ content: 'this is a post' });
    comment = await Comment.findOne({ content: 'this is another comment' });
    vote = await Vote.findOne();
});

afterAll(async() => await database.disconnect());

describe('vote model', () => {

    it('should return error if no user', () => {

        const newVote = new Vote({
            user: '',
            content: post._id
        })

        newVote.validate(err => {
            expect(err.errors.user).toBeTruthy();
        })

    })

    it('should return error if no content', () => {

        const newVote = new Vote({
            user: user._id,
            content: ''
        })

        newVote.validate(err => {
            expect(err.errors.content).toBeTruthy();
        })

    })

})

describe('vote controller', () => {

    const controller = require('../../src/vote/vote.controller');
    const mockResponse = () => {
        return {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            end: jest.fn().mockReturnThis()
        }
    }

    describe('create', () => {

        it('returns 201 if up vote made', async () => {

            const newVote = {
                user: user._id.toString(),
                content: post._id.toString()
            }

            const req = { body: newVote }
            const res = mockResponse();

            await controller.create(req, res);

            expect(res.status).toHaveBeenCalledWith(201);

        })

        it('returns 201 if down vote made', async () => {

            const newVote = {
                user: user._id.toString(),
                content: comment._id.toString(),
                down: true
            }

            const req = { body: newVote };
            const res = mockResponse();

            await controller.create(req, res);

            expect(res.status).toHaveBeenCalledWith(201);

        })

        it('returns 400 if vote already exists', async () => {

            const req = { body: { user: user._id, content: post._id } };
            const res = mockResponse();

            await controller.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'vote already exists' });

        })

        it('returns 400 if error creating vote', async () => {

            const req = { body: { user: '', content: '' } }
            const res = mockResponse();

            await controller.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'error creating vote' });

        })

    })

    describe('get', () => {

        it('returns 200 if votes for post retrieved', async () => {

            const req = { params: { id: post._id } };
            const res = mockResponse();

            await controller.get(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Array));

        })

        it('returns 200 if votes for comment retrieved', async () => {

            const req = { params: { id: comment._id } };
            const res = mockResponse();

            await controller.get(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Array));

        })

        it('returns 400 if post does not exist', async () => {

            const req = { params: { id: 'abc' } };
            const res = mockResponse();

            await controller.get(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'error retrieving votes' });

        })

    })

    describe('update', () => {

        it('returns 204 if vote updated', async () => {

            const req = { params: { id: vote._id, down: true }};
            const res = mockResponse();

            await controller.update(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.end).toHaveBeenCalled();

        })

        it('returns 400 if vote cannot be updated', async () => {

            const req = { params: { id: '', down: '' } }
            const res = mockResponse();

            await controller.update(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'error updating vote' });

        })

    })

    describe('delete', () => {

        it('returns 202 if vote deleted', async () => {

            const req = { params: { id: post._id } };
            const res = mockResponse();

            await controller.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(202);
            expect(res.end).toHaveBeenCalled();

        })

        it('returns 400 if vote cannot be deleted', async () => {

            const req = { params: { id: '' } };
            const res = mockResponse();

            await controller.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ error: 'vote could not be deleted' });

        })

    })

})

describe('vote routes', () => {

    let app;
    let request;
    let route;
    let mockController;
    let mockAuth;

    beforeAll(() => {
        mockController = require('../../src/vote/vote.controller');
        mockAuth = require('../../src/middleware/authenticator');

        jest.spyOn(mockController, 'create').mockImplementation((req, res) => res.end());
        jest.spyOn(mockController, 'get').mockImplementation((req, res) => res.end());
        jest.spyOn(mockController, 'update').mockImplementation((req, res) => res.end());
        jest.spyOn(mockController, 'delete').mockImplementation((req, res) => res.end()); 
        jest.spyOn(mockAuth, 'authenticateToken').mockImplementation((req, res, next) => next());

        route = '/api/votes';
        app = require('../../app');
        request = require('supertest')(app);
    })

    it('post request to /api/votes should call authenticateToken and create method of controller', async () => {

        await request.post(route);

        expect(mockAuth.authenticateToken).toHaveBeenCalled();
        expect(mockController.create).toHaveBeenCalled();

    })

    it('get request to /api/votes/post/:id should call getByPost method of controller', async () => {

        await request.get(`${route}/post/123}`);

        expect(mockController.get).toHaveBeenCalled();

    })

    it('get request to /api/votes/comment/:id should call getByComment method of controller', async () => {

        await request.get(`${route}/comment/123`);

        expect(mockController.get).toHaveBeenCalled();

    })

    it('put request to /api/votes/:id should call authenticateToken and update method of controller', async () => {

        await request.put(`${route}/123/true`);

        expect(mockAuth.authenticateToken).toHaveBeenCalled();
        expect(mockController.update).toHaveBeenCalled();

    })

    it('delete request to /api/votes/:id should call authenticateToken and delete method of controller', async () => {

        await request.delete(`${route}/123`);

        expect(mockAuth.authenticateToken).toHaveBeenCalled();
        expect(mockController.delete).toHaveBeenCalled();

    })

})

describe('vote helpers', () => {

    const { voteExists } = require('../../src/vote/vote.helpers');

    it('voteExists should return true is vote exists', async () => {

        const exists = await voteExists(user._id.toString(), postB._id.toString());

        expect(exists).toBeTruthy();

    })

    it('voteExists should return false if vote does not exist', async () => {

        const newComment = await Comment.create({
            user: user._id.toString(),
            post: post._id.toString(),
            content: 'this is a new comment' 
        })
        const exists = await voteExists(user._id.toString(), newComment._id.toString());

        expect(exists).toBeFalsy();

    })

    it('voteExists should return false if invalid user id or comment id provided', async () => {

        const exists = await voteExists('', '');

        expect(exists).toBeFalsy();

    })

})