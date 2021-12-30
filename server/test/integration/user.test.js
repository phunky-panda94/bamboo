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

    it('POST request to /api/user/register with valid input creates user in database and return status 201 and new user id', async () => {

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

    it('POST request to /api/user/register with existing email returns 400 and error message', async () => {

        const newUser = {
            firstName: 'Bob',
            lastName: 'Wayne',
            email: 'bwayne@wayne.com',
            password: 'batman'
        }

        const response = await request.post(route).send(newUser);

        expect(response.status).toBe(400);
        expect(response.body.error).toBeTruthy();
        expect(response.body.error).toBe('user already exists');

    })

    it('POST request to /api/user/register with invalid input returns 400 and error message', async () => {

        const newUser = {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        }

        const response = await request.post(route).send(newUser);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeTruthy();

    })

})

describe('login as existing user', () => {

    const route = '/api/user/login';

    it('POST request to /api/user/login with valid credentials returns status 200, user details and token', async () => {

        const userCredentials = {
            email: 'bwayne@wayne.com',
            password: 'batman'
        }

        const response = await request.post(route).send(userCredentials);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body).toHaveProperty('token');

    })

    it('POST request to /api/user/login with invalid credentials returns status 401 and invalid credentials error message', async () => {

        const userCredentials = {
            email: 'abc@email.com',
            password: 'password'
        }

        const response = await request.post(route).send(userCredentials);

        expect(response.status).toBe(401);
        expect(response.body.error).toBeTruthy();
        expect(response.body.error).toBe('invalid credentials');

    })

})

describe.only('get user details', () => {

    const User = require('../../src/user/user.model');
    const { createToken } = require('../../src/middleware/authenticator');

    it('GET request to /api/user/:id returns status 200 and user details if valid user token provided', async () => {

        const user = await User.findOne();
        const token = createToken(user.email);
        const route = user.url;

        const response = await request.get(route).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('firstName', 'Bruce');
        expect(response.body).toHaveProperty('lastName', 'Wayne');
        expect(response.body).toHaveProperty('email', 'bwayne@wayne.com');

    })

    it.only('GET request to /api/user/:id returns status 401 and unauthorized message if invalid user token provided', async () => {

        const user = await User.findOne();
        const route = user.url;
        
        const response = await request.get(route).set('Authorization', 'Bearer abc');

        expect(response.status).toBe(401);
        expect(response.body.error).toBeTruthy();
        expect(response.body.error).toBe('unauthorized');

    })

    it('GET request to /api/user/:id returns status 401 and unauthorized message if no user token provided', async () => {

        const user = await User.findOne();
        const route = user.url

        const response = await request.get(route);

        expect(response.status).toBe(401);
        expect(response.body.error).toBeTruthy();
        expect(response.body.error).toBe('no token in Authorization header');

    })

    it('GET request to /api/user/:id returns status 404 and user not found error message if user does not exist', async () => {

        const route = '/api/user/123';
        const token = createToken('123@email.com');

        const response = await request.get(route).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.error).toBeTruthy();
        expect(response.body.error).toBe('user not found');

    })

})