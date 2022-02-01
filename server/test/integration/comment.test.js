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

    it.only('POST request to /api/posts/:postId/comments to create new comment in database and return status 201', async () => {
        
        const response = await request.post(`${post.url}/comments/`)
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'this is a new comment' });

        expect(response.status).toBe(201);
        expect(response.body.content).toBe('this is a new comment');

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

        it('GET request to /api/posts/:postId/comments/:commentId for comment returns 200 and comment if it exists', async () => {

            const response = await request.get(`${comment.url}`);
            
            expect(response.status).toBe(200);
            expect(response.body.user._id).toBe(user._id.toString());
            expect(response.body.post).toBe(post._id.toString());
            expect(response.body.content).toBe('this is a comment');

        })

        it('GET request to /api/posts/:postId/comments/:commentId for comment returns 404 and error if it does not exist', async () => {

            const response = await request.get(`${post.url}/comments/123`);

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('comment not found');

        })

    })

    describe('post comments', () => {
        
        it('GET request to /api/posts/:postId/comments returns 200 and array of comments', async () => {

            const response = await request.get(`${post.url}/comments`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(expect.any(Array));

        })

        it('GET request to /api/posts/:postId/comments returns 404 if post not found', async () => {

            const response = await request.get('/api/posts/123/comments');

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('post not found');

        })

    })

})

describe('update comment', () => {

    it('PUT request to /api/posts/:postId/comments/:commentId updates comment in database and returns status 204', async () => {
        
        const response = await request.put(comment.url)
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'this is an updated comment' });

        expect(response.status).toBe(204);

        const updatedComment = await Comment.findById(comment._id);

        expect(updatedComment.content).toBe('this is an updated comment');

    })

    it('PUT request to /api/posts/:postId/comments/:commentId returns 401 unauthorised if invalid token', async () => {

        const response = await request.put(comment.url)
            .set('Authorization', 'Bearer abc')
            .send({ content: 'this is an updated comment' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('unauthorized');

    })

    it('PUT request to /api/posts/:postId/comments/:commentId returns 401 unauthorised if no token', async () => {

        const response = await request.put(comment.url)
            .send({ content: 'this is an updated comment' });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('no token in Authorization header');
    })

    it('PUT request to /api/posts/:postId/comments/:commentId returns 403 forbidden if not author of comment', async () => {

        const validToken = createToken('id')

        const response = await request.put(comment.url)
            .set('Authorization', `Bearer ${validToken}`)
            .send({ content: 'this is updated comment' });

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('forbidden');

    })

    it('PUT request to /api/posts/:postId/comments/:commentId returns 400 if comment could not be updated', async () => {

        const response = await request.put(comment.url)
            .set('Authorization', `Bearer ${token}`)
            .send({ content: '' });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('comment could not be updated');

    })

    it('PUT request to /api/posts/:postId/comments/:commentId returns 404 if comment not found', async () => {

        const response = await request.put(`${post.url}/comments/123`)
            .set('Authorization', `Bearer ${token}`)
            .send({ content: 'this is an updated comment' });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('comment not found');

    })


})

describe('delete comment', () => {

    it('DElETE request to /api/posts/:postId/comments/:commentId returns 404 if comment not found', async () => {

        const response = await request.delete(`${post.url}/comments/123`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('comment not found');
    })

    it('DELETE request to /api/posts/:postId/comments/:commentId returns 403 and forbidden if not author of comment', async () => {

        const validToken = createToken('id');

        const response = await request.delete(comment.url)
            .set('Authorization', `Bearer ${validToken}`)

        expect(response.status).toBe(403);
        expect(response.body.error).toBe('forbidden');

    })

    it('DELETE request to /api/posts/:postId/comments/:commentId returns 401 and error message if no token', async () => {

        const response = await request.delete(comment.url)

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('no token in Authorization header')

    })

    it('DELETE request to /api/posts/:postId/comments/:commentsId returns 401 and unauthorized if invalid token', async () => {

        const response = await request.delete(comment.url)
            .set('Authorization', 'Bearer abc')

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('unauthorized');

    })

    it('DELETE request to /api/posts/:postId/comments/:commentId deletes comment from database and returns status 202', async () => {

        const response = await request.delete(comment.url)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(202);
        expect(await Comment.findById(comment._id)).toBeFalsy();

    })

})