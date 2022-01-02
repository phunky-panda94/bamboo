const database = require('../../util/memoryDatabase');
const User = require('../../src/user/user.model');

let user;

beforeAll(async () => { 
    await database.connect(); 
    await database.seed();
    user = await User.findOne(); 
});

afterAll(async () => await database.disconnect());

describe('user model', () => {

    it('should be invalid if first name is empty', () => {
        let newUser = new User();

        newUser.validate(err => {
            expect(err.errors.firstName).toBeTruthy();
        })
    })

    it('should be invalid if last name is empty', () => {
        let newUser = new User();

        newUser.validate(err => {
            expect(err.errors.lastName).toBeTruthy();
        })
    })

    it('should be invalid if email is empty', () => {
        let newUser = new User();

        newUser.validate(err => {
            expect(err.errors.email).toBeTruthy();
        })
    })

    it('should be invalid if password is empty', () => {
        let newUser = new User();

        newUser.validate(err => {
            expect(err.errors.password).toBeTruthy();
        })
    })

    it('should be invalid if password less than 5 characters', () => {
        let newUser = new User({
            firstName: 'John',
            lastName: 'Smith',
            email: 'email@email.com',
            password: 'abc'
        })

        newUser.validate(err => {
            expect(err.errors.password).toBeTruthy();
        })
    })

    it('virtual fullname method should return first name and last name', () => {
        let newUser = new User({
            firstName: 'John',
            lastName: 'Smith',
            email: 'johnsmith@email.com'
        })

        expect(newUser.fullName).toBe(`${newUser.firstName} ${newUser.lastName}`);
    })

    it('virtual url method should return api route', async () => {

        expect(user.url).toBe(`/api/user/${user._id}`);

    })

    it('should be created when required parameters provided', async () => {
        
        const newUser = await User.create({
            firstName: 'John',
            lastName: 'Smith',
            email: 'johnsmith@email.com',
            password: 'password'
        })

        expect(await User.findById(newUser._id)).toBeTruthy();

    })

});

describe('user controller', () => {

    const controller = require('../../src/user/user.controller');
    const { checkPassword } = require('../../src/middleware/authenticator');
    const bcrypt = require('bcryptjs');

    const mockResponse = () => {
        return {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            end: jest.fn().mockReturnThis()
        }
    }

    it('register calls create method of user and returns status 201 if successfully created', async () => {

        const newUser = {
            firstName: 'James',
            lastName: 'Bond',
            email: 'jbond@email.com',
            password: 'password'
        }

        const req = { body: newUser }

        const res = mockResponse();

        await controller.register(req, res);
        
        expect(res.status).toHaveBeenCalledWith(201);
        

    })

    it('register returns 400 and error message if user with same email already exists', async () => {

        const user = {
            firstName: 'Bruce',
            lastName: 'Wayne',
            email: 'bwayne@wayne.com',
            password: 'batman'
        }

        const req = { body: user };
        const res = mockResponse();

        await controller.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'user already exists' })

    })

    it('register returns 400 and error message if error creating user', async () => {

        const newUser = {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        }

        const req = { body: newUser }
        const res = mockResponse();

        await controller.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'user could not be registered' });


    })

    it('login returns status 200 with user details and token', async () => {

        const req = { body: { user: 'user', token: 'token' } }

        const res = mockResponse();

        await controller.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(req.body);

    })

    it('getUser returns status 200 and user details', async () => {

        const req = { params: { id: user._id } }
        const res = mockResponse();

        await controller.getUser(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            firstName: expect.any(String),
            lastName: expect.any(String),
            email: expect.any(String)
        }));

    })

    it('getUser returns status 404 and message if user not found', async () => {

        const req = { params: { id: 'abc' } }
        const res = mockResponse();

        await controller.getUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'user not found' })
        expect(res.json).toHaveBeenCalledTimes(1);

    })

    it('updatePassword returns status 204 and token if user password successfully updated', async () => {

        const password = await bcrypt.hash('newpassword', 10);
        const req = {
            body: { password: password },
            params: { id: user._id } 
        }
        const res = mockResponse();

        await controller.updatePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.end).toHaveBeenCalled();

        const updatedUser = await User.findById(user._id);
        const match = await checkPassword('newpassword', updatedUser.password);

        expect(match).toBeTruthy();

    })

    it('updatePassword returns status 404 and error message if user does not exist', async () => {

        const req = {
            body: { password: 'newpassword' },
            params: { id: 'abc' }
        }

        const res = mockResponse();

        await controller.updatePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'user does not exist' });

    })
    
    it('updatePassword returns status 400 and error message if user password could not be updated', async () => {

        const req = {
            body: { password: '' },
            params: { id: user._id } 
        }

        const res = mockResponse();

        await controller.updatePassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'user password could not be updated' });

    })

    it('updateEmail returns status 204 and token if user email successfully updated', async () => {

        const req = {
            body: { email: 'new@email.com' },
            params: { id: user._id } 
        }
        const res = mockResponse();

        await controller.updateEmail(req, res);

        expect(res.status).toHaveBeenCalledWith(204);

        const updatedUser = await User.findById(user._id);

        expect(updatedUser.email).toBe('new@email.com');

    })

    it('updateEmail returns status 404 and error message if user does not exist', async () => {

        const req = {
            body: { email: 'new@email.com' },
            params: { id: 'abc' }
        }

        const res = mockResponse();

        await controller.updateEmail(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'user does not exist' });

    })
    
    it('updateEmail returns status 400 and error message if email already taken', async () => {

        const existingUser = await User.create({
            firstName: 'John',
            lastName: 'Smith',
            email: 'taken@email.com',
            password: 'password'
        })

        const req = { 
            body: { email: existingUser.email },
            params: { id: user._id }
        }

        const res = mockResponse();

        await controller.updateEmail(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'email address already taken' });

    })

    it('updateEmail returns status 400 and error message if user email could not be updated', async () => {

        const req = {
            body: { email: '' },
            params: { id: user._id } 
        }

        const res = mockResponse();

        await controller.updateEmail(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'user email could not be updated' });

    })

    it('deleteUser returns status 202 if user succesfully deleted', async () => {

        const req = { params: { id: user._id } };
        const res = mockResponse();

        await controller.deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(202);
        expect(res.end).toHaveBeenCalled();

        const deletedUser = await User.findById(user._id);

        expect(deletedUser).toBeFalsy();

    })

    it('deleteUser returns status 400 and error message if user does not exist', async () => {

        const req = { params: { id: 'abc' } };
        const res = mockResponse();

        await controller.deleteUser(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.status).toHaveBeenCalledTimes(1);
        expect(res.json).toHaveBeenCalledWith({ error: 'user could not be deleted' });

    })

});

describe('user routes', () => {

    let app;
    let request;
    let route;
    let mockAuth;
    let mockController;

    beforeAll(() => {
        mockAuth = require('../../src/middleware/authenticator');
        mockValidator = require('../../src/middleware/validator');
        mockController = require('../../src/user/user.controller');
        
        jest.spyOn(mockAuth, 'authenticateUser').mockImplementation((req, res, next) => next());
        jest.spyOn(mockAuth, 'authenticateToken').mockImplementation((req, res, next) => next());
        jest.spyOn(mockAuth, 'encryptPassword').mockImplementation((req, res, next) => next());
        jest.spyOn(mockController, 'login').mockImplementation((req, res) => res.end());
        jest.spyOn(mockController, 'register').mockImplementation((req, res) => res.end());
        jest.spyOn(mockController, 'getUser').mockImplementation((req, res) => res.end());
        jest.spyOn(mockController, 'updateEmail').mockImplementation((req, res) => res.end());
        jest.spyOn(mockController, 'updatePassword').mockImplementation((req, res) => res.end());
        jest.spyOn(mockController, 'deleteUser').mockImplementation((req, res) => res.end());

        mockValidator.validateNewUserDetails = jest.fn().mockImplementation((req, res, next) => next());
        mockValidator.validateEmail = jest.fn().mockImplementation((req, res, next) =>  next());
        mockValidator.validatePassword = jest.fn().mockImplementation((req, res, next) => next());

        route = '/api/user';
        app = require('../../app');
        request = require('supertest')(app);
    })

    it('GET request to /api/user/:id should call authenticateToken and get method of controller', async () => {

        await request.get(`${route}/user123`);

        expect(mockAuth.authenticateToken).toHaveBeenCalled();
        expect(mockController.getUser).toHaveBeenCalled();

    })

    it('POST request to /api/user/register should call register method of controller', async () => {

        await request.post(`${route}/register`);

        expect(mockValidator.validateNewUserDetails).toHaveBeenCalled();
        expect(mockController.register).toHaveBeenCalled();

    })

    it('POST request to /api/user/login should call authenticateUser and login method of controller', async () => {

        await request.post(`${route}/login`);

        expect(mockAuth.authenticateUser).toHaveBeenCalled();
        expect(mockController.login).toHaveBeenCalled();

    })

    it('PUT request to /api/user/:id/email should call authenticateToken, validateEmail and updateEmail method of controller', async () => {

        await request.put(`${route}/user123/email`);

        expect(mockAuth.authenticateToken).toHaveBeenCalled();
        expect(mockValidator.validateEmail).toHaveBeenCalled();
        expect(mockController.updateEmail).toHaveBeenCalled();

    })

    it('PUT request to /api/user/:id/password should call authenticateToken, validatePassword, encryptPassword and updatePassword method of controller', async () => {

        await request.put(`${route}/user123/password`);

        expect(mockAuth.authenticateToken).toHaveBeenCalled();
        expect(mockValidator.validatePassword).toHaveBeenCalled();
        expect(mockAuth.encryptPassword).toHaveBeenCalled();
        expect(mockController.updatePassword).toHaveBeenCalled();

    })

    it('DELETE request to /api/user/:id should call authenticateToken and deleteUser method of controller', async () => {

        await request.delete(`${route}/user123`);

        expect(mockAuth.authenticateToken).toHaveBeenCalled();
        expect(mockController.deleteUser).toHaveBeenCalled();

    })

})

describe('user helpers', () => {

    const faker = require('faker');
    const { userExists } = require('../../src/user/user.helpers');

    it('should return true if user exists', async () => {

        const user = await User.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        })

        const exists = await userExists(user.email);

        expect(exists).toBeTruthy();

    })

    it('should return false if user does not exist', async () => {

        const exists = await userExists('unknown@email.com');

        expect(exists).toBeFalsy();

    })

})


