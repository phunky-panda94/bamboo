const app = require('../../app');
const request = require('supertest')(app);
const database = require('../../util/memoryDatabase');

beforeAll(async () => { 
    await database.connect(); 
    await database.seed(); 
});

afterAll(async () => await database.disconnect());

describe('register new user', () => {

    const User = require('../../src/user/user.model');
    const route = '/api/user/register';

    it('POST request to /api/user/register with valid input should create user in database and return status 201 and new user id', async () => {

        const newUser = {
            firstName: 'John',
            lastName: 'Smith',
            email: 'jsmith@email.com',
            password: 'password'
        }

        const response = await request.post(route).send(newUser);
        
        const savedUser = await User.findOne({ email: newUser.email });

        expect(response.status).toBe(201);
        expect(savedUser).toBeTruthy();

    })

})

describe('login as existing user', () => {

    const route = '/api/user/login';

    it('POST request to /api/user/login with valid credentials should return status 200, user details and token', async () => {

        const userCredentials = {
            email: 'bwayne@wayne.com',
            password: 'batman'
        }

        const response = await request.post(route).send(userCredentials);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');

    })

})

describe('get user details', () => {

    const User = require('../../src/user/user.model');
    const { createToken } = require('../../src/middleware/authenticator');

    it('should return status 200 and user details if valid user token provided', async () => {

        const user = await User.findOne();
        const token = createToken(user.email);

        const route = user.url;
        const response = await request.get(route).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('firstName', 'Bruce');
        expect(response.body).toHaveProperty('lastName', 'Wayne');
        expect(response.body).toHaveProperty('email', 'bwayne@wayne.com');

    })

})