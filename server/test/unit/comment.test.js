const database = require('../../util/memoryDatabase');

const User = require('../../src/user/user.model');
const Post = require('../../src/post/post.model');
const Comment = require('../../src/comment/comment.model');

let user;
let post;
let comment;

beforeAll(async () => { 
    await database.connect();
    await database.seed();
    user = await User.findOne({ email: 'bwayne@wayne.com' });
    post = await Post.findOne({ author: user._id, content: 'this is a post' });
    comment = await Comment.findOne({ content: 'this is a comment' });
});

afterAll(async() => await database.disconnect());

describe('comment model', () => {

    it('should return error if no user', () => {

        const newComment = new Comment({
            user: '',
            post: '',
            content: '',
        })

        newComment.validate(err => {
            expect(err.errors.user).toBeTruthy();
        })

    })

    it('should return error if no post' , () => {

        const newComment = new Comment({
            user: '',
            post: '',
            content: '',
        })

        newComment.validate(err => {
            expect(err.errors.post).toBeTruthy();
        })

    })

    it('should return error if no content', () => {

        const newComment = new Comment({
            user: '',
            post: '',
            content: '',
        })

        newComment.validate(err => {
            expect(err.errors.content).toBeTruthy();
        })

    })

    it('virtual url method should return url for comment', () => {

        expect(comment.url).toBe(`/api/posts/${post._id}/comments/${comment._id}`);

    })

})

describe('comment controller', () => {

    const controller = require('../../src/comment/comment.controller');
    const mockResponse = () => {
        return {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            end: jest.fn().mockReturnThis()
        }
    }

    describe('create', () => {

        it('create should return status 201 if comment successfully created', async () => {

            const req = {
                params: { postId: post._id },
                body: { user: user._id, content: 'this is a new comment' }
            }
            const res = mockResponse();

            await controller.create(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ id: expect.anything() });

        })

        it('create should return status 400 if error saving new comment to database', async () => {

            const req = {
                params: { user: '', postId: '' },
                body: { content: '' }
            }
            const res = mockResponse();

            await controller.create(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ error: 'comment could not be created' });

        })

    })

    describe('get', () => {

        it('get should return status 200 and comment object if comment successfully retrieved', async () => {

            const req = { params: { commentId: comment._id } }
            const res = mockResponse();

            await controller.get(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Object));

        })

        it('get should return status 404 if comment not found', async () => {

            const req = { params: { commentId: '' } }
            const res = mockResponse();

            await controller.get(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ error: 'comment not found' });

        })

        it('getByPost should return status 200 if comments succesfully retrieved', async () => {

            const req = { params: { postId: post._id } };
            const res = mockResponse();

            const comments = await Comment.find({});

            await controller.getByPost(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.anything());

        })

    })

    describe('update', () => {

        it('update should return status 204 if comment successfully update', async () => {

            const req = {
                body: { 
                    content: 'this is an updated comment',
                    user: user._id.toString()
                },
                params: { commentId: comment._id }
            }

            const res = mockResponse();

            await controller.update(req, res);

            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.end).toHaveBeenCalled();

        })

        it('update should return status 404 if comment not found', async () => {

            const req = {
                body: { 
                    content: 'this is an updated comment',
                    user: user._id
                },
                params: { commentId: '' }
            }

            const res = mockResponse();

            await controller.update(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ error: 'comment not found' });

        })

        it('update should return status 400 if comment could not be updated', async () => {

            const req = {
                body: { 
                    content: '',
                    user: user._id.toString()
                },
                params: { commentId: comment._id }
            }

            const res = mockResponse();

            await controller.update(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith({ error: 'comment could not be updated' });

        })

        it('update should return status 403 and forbidden if user not author of comment', async () => {

            const req = { 
                params: { commentId: comment._id },
                body: { user: 'abc' } 
            }
            const res = mockResponse();

            await controller.update(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'forbidden' });

        })
    
    })

    describe('delete', () => {

        it('delete should return status 403 and forbidden if user if not author of comment', async () => {

            const req = { 
                params: { commentId: comment._id },
                body: { user: 'abc' } 
            }
            const res = mockResponse();

            await controller.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ error: 'forbidden' });

        })

        it('delete should return status 404 if comment could not be deleted', async () => {

            const req = { 
                params: { commentId: '123' },
                body: { user: user._id.toString() }
            }
            const res = mockResponse();

            await controller.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ error: 'comment not found' })

        })

        it('delete should return status 202 if comment deleted', async () => {

            const req = { 
                params: { commentId: comment._id },
                body: { user: user._id.toString() } 
            }
            const res = mockResponse();

            await controller.delete(req, res);

            expect(res.status).toHaveBeenCalledWith(202);
            expect(res.end).toHaveBeenCalled();

        })

    })

})

describe('comment routes', () => {

    let app;
    let request;
    let route;
    let mockController;
    let mockAuth;

    beforeAll(() => {
        mockController = require('../../src/comment/comment.controller');
        mockAuth = require('../../src/middleware/authenticator');

        jest.spyOn(mockController, 'create').mockImplementation((req, res) => res.end());
        jest.spyOn(mockController, 'getByPost').mockImplementation((req, res) => res.end());
        jest.spyOn(mockController, 'get').mockImplementation((req, res) => res.end());
        jest.spyOn(mockController, 'update').mockImplementation((req, res) => res.end());
        jest.spyOn(mockController, 'delete').mockImplementation((req, res) => res.end()); 
        jest.spyOn(mockAuth, 'authenticateToken').mockImplementation((req, res, next) => next());

        route = '/api/posts/1/comments';
        app = require('../../app');
        request = require('supertest')(app);
    })

    it('post request to /api/posts/:id/comments calls authenticateToken and create method of controller', async () => {

        await request.post(`${route}/`);

        expect(mockAuth.authenticateToken).toHaveBeenCalled();
        expect(mockController.create).toHaveBeenCalled();

    })

    it('get request to /api/posts/:id/comments calls getByPost method of controller', async () => {

        await request.get(`${route}/`);

        expect(mockController.getByPost).toHaveBeenCalled();

    })

    it('get request to /api/posts/:id/comments/:id calls get method of controller', async () => {

        await request.get(`${route}/1`);

        expect(mockController.get).toHaveBeenCalled();

    })

    it('put request to /api/posts/:id/comments/:id calls authenticateToken and update method of controller', async () => {

        await request.put(`${route}/1`);

        expect(mockController.update).toHaveBeenCalled();

    })

    it('delete request to /api/posts/:id/comments/:id calls authenticateToken and delete method of controller', async () => {

        await request.delete(`${route}/1`);

        expect(mockController.delete).toHaveBeenCalled();

    })

})