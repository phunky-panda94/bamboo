const app = require('../../app');
const request = require('supertest')(app);
const database = require('../../util/memoryDatabase');

const User = require('../../src/user/user.model');
const Post = require('../../src/post/post.model');
const Comment = require('../../src/comment/comment.model');
const Vote = require('../../src/vote/vote.model');
const { voteExists } = require('../../src/vote/vote.helpers');
const { createToken } = require('../../src/middleware/authenticator');
const route = '/api/votes';

let user;
let token;
let postA;
let postB;
let comment;
let vote;

beforeAll(async () => { 
    await database.connect(); 
    await database.seed(); 
    user = await User.findOne();
    token = createToken(user._id.toString());
    postA = await Post.findOne({ content: 'this is a post' });
    postB = await Post.findOne({ content: 'this is another post' });
    comment = await Comment.findOne({ content: 'this is a comment' });
    vote = await Vote.findOne({ down: false });
});

afterAll(async () => await database.disconnect());

describe('create', () => {

    it('POST request to /api/votes should create vote in database and return status 201', async () => {

        const newVote = {
            user: user._id,
            content: postB._id
        }

        const response = await request.post(route)
            .set('Authorization', `Bearer ${token}`)
            .send(newVote);
        
        expect(response.status).toBe(201);

        const voteSaved = await voteExists(user._id, postB._id);

        expect(voteSaved).toBeTruthy();

    })

    it('POST request to /api/votes should return status 400 and error message if vote already exists', async () => {

        const newVote = {
            user: user._id,
            content: comment._id
        }

        const response = await request.post(route)
            .set('Authorization', `Bearer ${token}`)
            .send(newVote);

        expect(response.status).toBe(400)
        expect(response.body.error).toBe('vote already exists');

    })

    it('POST request to /api/votes should return status 400 and error message if vote could not be created', async () => {

        const newVote = {
            user: '',
            content: ''
        }

        const response = await request.post(route)
            .set('Authorization', `Bearer ${token}`)
            .send(newVote);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('error creating vote');        

    })

})

describe('get', () => {

    it('GET request to /api/votes/comment/:id should return vote and status 200', async () => {

        const response = await request.get(`${route}/comment/${comment._id.toString()}`);

        expect(response.status).toBe(200);
        expect(response.body[0].user).toBe(user._id.toString());
        expect(response.body[0].content).toBe(comment._id.toString());

    })

    it('GET request to /api/votes/post/:id should return vote and status 200', async () => {

        const response = await request.get(`${route}/post/${postA._id.toString()}`);

        expect(response.status).toBe(200);
        expect(response.body[0].user).toBe(user._id.toString());
        expect(response.body[0].content).toBe(postA._id.toString());

    })

    it('GET request to /api/votes/comtent/:id returns 400 and error message if content does not exist', async () => {

        const response = await request.get(`${route}/comment/123`);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('error retrieving votes');

    })

})

describe('update', () => {

    it('PUT request to /api/votes/:id/true should update vote to down vote and return status 204', async () => {

        const response = await request.put(`${route}/${vote._id.toString()}/true`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);

        const updatedVote = await Vote.findById(vote._id.toString());

        expect(updatedVote.down).toBeTruthy();

    })

    it('PUT request to /api/votes/:id/:down should return 400 and error message', async () => {

        const response = await request.put(`${route}/123/abc`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('error updating vote');

    })

})

describe('delete', () => {

    it('DELETE request to /api/votes/:id removes vote from database and return status 202', async () => {

        const response = await request.delete(`${route}/${vote._id.toString()}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(202);
        
        const deletedVote = await voteExists(user._id.toString(), vote._id.toString());

        expect(deletedVote).toBeFalsy();

    })

    it('DELETE request to /api/votes/123 returns status 400 and error message', async () => {

        const response = await request.delete(`${route}/123`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.error).toBe('error deleting vote');

    })

})