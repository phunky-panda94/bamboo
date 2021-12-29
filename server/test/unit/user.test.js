const database = require('../../util/memoryDatabase');

beforeAll(async () => { await database.connect(); await database.seed() });

afterAll(async () => await database.disconnect());

describe('user model', () => {

    const User = require('../../src/user/user.model');

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

    it('virtual fullname method should return first name and last name', () => {
        let newUser = new User({
            firstName: 'John',
            lastName: 'Smith',
            email: 'johnsmith@email.com'
        })

        expect(newUser.fullName).toBe(`${newUser.firstName} ${newUser.lastName}`);
    })

    it('virtual url method should return api route', async () => {

        const user = await User.findOne();

        expect(user.url).toBe(`/api/user/${user._id}`);

    })

    it('should be created when required parameters provided', async () => {
        let newUser = new User({
            firstName: 'John',
            lastName: 'Smith',
            email: 'johnsmith@email.com',
            password: 'password'
        })

        await newUser.save();

        const foundUser = await User.findOne({ email: 'johnsmith@email.com' });

        expect(foundUser.password).toEqual(newUser.password);

    })

});

describe('user controller', () => {

    const User = require('../../src/user/user.model');
    const controller = require('../../src/user/user.controller');
    const faker = require('faker');

    const mockResponse = () => {
        return {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            end: jest.fn().mockReturnThis()
        }
    }

    it('register calls create method of user and returns status 201 if successfully created', async () => {

        const newUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
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

        const user = await User.findOne();
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

        const req = { params: { id: '' } }
        const res = mockResponse();

        await controller.getUser(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'user not found' })

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
        jest.spyOn(mockController, 'login').mockImplementation((req, res) => res.end());
        jest.spyOn(mockController, 'register').mockImplementation((req, res) => res.end());
        jest.spyOn(mockController, 'getUser').mockImplementation((req, res) => res.end());

        mockValidator.validateNewUserDetails = jest.fn().mockImplementation((req, res, next) => next());

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

    it('POST request to /api/user/login should call login method of controller', async () => {

        await request.post(`${route}/login`);

        expect(mockAuth.authenticateUser).toHaveBeenCalled();
        expect(mockController.login).toHaveBeenCalled();

    })

})

describe('user helpers', () => {

    const { userExists } = require('../../src/user/user.helpers');

    it('should return true if user exists', async () => {

        const exists = await userExists('bwayne@wayne.com');

        expect(exists).toBeTruthy();

    })

    it('should return false if user does not exist', async () => {

        const exists = await userExists('unknown@email.com');

        expect(exists).toBeFalsy();

    })

})


