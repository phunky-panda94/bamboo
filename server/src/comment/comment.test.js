describe('comment model', () => {

    const Comment = require('./comment.model');

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

})

describe('comment controller', () => {

    const controller = require('./comment.controller');

    const User = require('../user/user.model');
    const Post = require('../post/post.model');
    const Comment = require('../comment/comment.model');

    const database = require('../../util/memoryDatabase');

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

    const mockResponse = () => {
        return {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }
    }

    it('create should return status 201 if comment successfully created', async () => {

        const newComment = {
            user: user._id,
            post: post._id,
            content: 'this is a new comment' 
        }

        const req = {
            body: newComment
        }
        const res = mockResponse();

        await controller.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);

    })

    it('create should return status 400 if error saving new comment to database', async () => {

        const newComment = {
            user: '',
            post: '',
            content: ''
        }

        const req = {
            body: newComment
        }
        const res = mockResponse();

        await controller.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'comment could not be created' });

    })

    it('get should return status 200 and comment object if comment successfully retrieved', async () => {

        const params = { comment: comment._id }
        const req = { params: params }
        const res = mockResponse();

        await controller.get(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(comment);

    })

    it('get should return status 404 if comment not found', async () => {

        const params = { comment: '' }
        const req = { params: params }
        const res = mockResponse();

        await controller.get(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'comment not found' });

    })

    it('getAll should return status 200 if comments succesfully retrieved', async () => {

        const req = {};
        const res = mockResponse();

        const comments = await Comment.find({});

        await controller.getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(comments)

    })

    it('update should return status 204 if comment successfully update', async () => {

        const updatedComment = {
           comment: comment._id,
           content: 'this is an updated comment'
        }

        const req = {
            body: updatedComment
        }

        const res = mockResponse();

        await controller.update(req, res);

        expect(res.status).toHaveBeenCalledWith(204);

    })

    it('update should return status 400 if comment could not be updated', async () => {

        const updatedComment = {
            comment: '',
            content: 'this is an updated comment'
        }

        const req = {
            body: updatedComment
        }

        const res = mockResponse();

        await controller.update(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'comment could not be updated' });

    })

    it('delete should return status 202 if comment deleted', async () => {

        const params = { comment: comment._id }
        const req = { params: params }
        const res = mockResponse();

        await controller.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(202);

    })

    it('delete should return status 400 if comment could not be deleted', async () => {

        const params = { comment: '123' }
        const req = { params: params }
        const res = mockResponse();

        await controller.delete(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'comment could not be deleted' })

    })

})