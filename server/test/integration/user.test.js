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

describe('get user details', () => {

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

    it('GET request to /api/user/:id returns status 401 and unauthorized message if invalid user token provided', async () => {

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

describe('update user details', () => {

    const User = require('../../src/user/user.model');
    const { createToken } = require('../../src/middleware/authenticator');
    let token;
    let user;
    let emailRoute;
    let passwordRoute;

    beforeAll(async () => { 
        user = await User.findOne();
        token = createToken(JSON.stringify(user._id));
        emailRoute = `${user.url}/email`;
        passwordRoute = `${user.url}/password`;
    })

    describe('email', () => {

        it('PUT request to /api/user/:id/email updates user email in database and returns status 204 with new token', async () => {
            
            const response = await request.put(emailRoute)
                .set('Authorization', `Bearer ${token}`)
                .send({ email: 'new@email.com' });

            expect(response.status).toBe(204);

            const updatedUser = await User.findById(user._id);

            expect(updatedUser).toBeTruthy();
            expect(updatedUser.email).toBe('new@email.com');

        })

        it('PUT request to /api/user/:id/email with invalid token returns status 401 and unauthorized message', async () => {

            const response = await request.put(emailRoute)
                .set('Authorization', 'Bearer abc')
                .send({ email: 'new@email.com' });

            expect(response.status).toBe(401);
            expect(response.body.error).toBeTruthy();
            expect(response.body.error).toBe('unauthorized');

        })

        it('PUT request to /api/user/:id/email returns status 404 and error message if user does not exist', async () => {

            const response = await request.put('/api/user/123/email')
                .set('Authorization', `Bearer ${token}`)
                .send( { email: 'new@email.com' });

            expect(response.status).toBe(404);
            expect(response.body.error).toBeTruthy();
            expect(response.body.error).toBe('user does not exist');

        })

        it('PUT request to /api/user/:id/email with invalid email returns status 400 and error message', async () => {

            const response = await request.put(emailRoute)
                .set('Authorization', `Bearer ${token}`)
                .send({ email: 'abc' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBeTruthy();
            expect(response.body.error).toBe('invalid email address');

        })

        it('PUT request to /api/user:id/email with taken email address returns 400 and error message', async () => {

            const existingUser = await User.create({
                firstName: 'John',
                lastName: 'Smith',
                email: 'taken@email.com',
                password: 'password'
            })

            const response = await request.put(emailRoute)
                .set('Authorization', `Bearer ${token}`)
                .send({ email: 'taken@email.com' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBeTruthy();
            expect(response.body.error).toBe('email address already taken');

        })

    })

    describe('password', () => {

        it('PUT request to /api/user/:id/password updates user password in database and returns status 204', async () => {

            const response = await request.put(passwordRoute)
                .set('Authorization', `Bearer ${token}`)
                .send({ password: 'newpassword' });

            expect(response.status).toBe(204);

        })

        it('PUT request to /api/user/:id/password with invalid token returns status 401 and unauthorized message', async () => {
            
            const response = await request.put(passwordRoute)
                .set('Authorization', 'Bearer abc')
                .send({ password: 'newpassword' });

            expect(response.status).toBe(401);
            expect(response.body.error).toBeTruthy();
            expect(response.body.error).toBe('unauthorized');

        })

        it('PUT request to /api/user/:id/password returns status 404 if user does not exist', async () => {

            const response = await request.put('/api/user/123/password')
                .set('Authorization', `Bearer ${token}`)
                .send({ password: 'newpassword' });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe('user does not exist');

        })

        it('PUT request to /api/user/:id/password with invalid password returns status 400 and error message', async() => {

            const response = await request.put(passwordRoute)
                .set('Authorization', `Bearer ${token}`)
                .send({ password: 'abc' });

            expect(response.status).toBe(400);
            expect(response.body.error).toBeTruthy();
            expect(response.body.error).toBe('invalid password');

        })

    })

})

describe('delete user', () => {

    const User = require('../../src/user/user.model');
    const { userExists } = require('../../src/user/user.helpers');
    const { createToken } = require('../../src/middleware/authenticator');
    let user;
    let token;
    let route;

    beforeAll(async () => {
        user = await User.findOne();
        token = createToken(user.email);
        route = user.url;
    });

    it('DELETE request to /api/user/:id deletes users from database and returns status 202', async () => {

        const response = await request.delete(route)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(202);
        expect(await userExists(user.email)).toBeFalsy();

    })

    it('DELETE request to /api/user/:id with invalid token return status 401 and unauthorized message', async () => {

        const response = await request.delete(route)
            .set('Authorization', 'Bearer abc')

        expect(response.status).toBe(401);
        expect(response.body.error).toBeTruthy();
        expect(response.body.error).toBe('unauthorized');

    })

    it('DELETE request to /api/user/:id returns status 400 and error message if user could not be deleted', async () => {

        const response = await request.delete('/api/user/123')
        .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(400);
        expect(response.body.error).toBeTruthy();
        expect(response.body.error).toBe('user could not be deleted');

    })

})