const Post = require('../src/post/post.model');
const User = require('../src/user/user.model');
const controller = require('../src/post/post.controller');

// mocks
const mockRequest = (body) => {
    return {
        body: body
    }
}

const mockResponse = () => {
    return {
        status: jest.fn().mockReturnValue({}),
        json: jest.fn().mockReturnValue({})
    }
}

const database = require('../util/memoryDatabase');

beforeAll(async () => { 
    await database.connect();
    await database.seed();
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

    it.only('create should add post to database and return status 201', async () => {
        
        const user = await User.findOne({ email: 'bwayne@wayne.com' })
        const content = "I'm Batman";

        const req = mockRequest({
            user: user._id,
            content: content
        })

        const res = mockResponse();

        await controller.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);

    })

    it('update should update the post in datebase and return status 204', async () => {

    })

    it('get should return the post from the database and return status 200', async () => {

    })

    it('delete should remove the post from the database and return status 202', async () => {

    })

})