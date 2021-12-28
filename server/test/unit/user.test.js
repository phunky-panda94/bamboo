const database = require('../../util/memoryDatabase');

beforeAll(async () => await database.connect());

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

    const controller = require('../../src/user/user.controller');
    const faker = require('faker')

    const mockAuth = require('../../src/middleware/auth');
    jest.spyOn(mockAuth, 'encryptPassword').mockImplementation((password) => { console.log('called'); return password });

    const mockUser = require('../../src/user/user.model');
    jest.spyOn(mockUser.prototype, 'save').mockReturnValue();

    const mockResponse = () => {
        return {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }
    }

    const next = jest.fn().mockReturnValue();

    it('validate returns status 400 and validation errors if invalid input', async () => {

        const newUser = {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        }

        const req = {
            body: newUser
        }

        const res = mockResponse();

        await controller.validate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ errors: expect.anything() });

    })

    it.only('register calls encryptPassword and save before returning status 201 if no errors', async () => {

        const newUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }

        const req = {
            body: newUser
        }

        const res = mockResponse();

        await controller.register(req, res);

        expect(mockAuth.encryptPassword).toHaveBeenCalled();
        expect(mockUser.prototype.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);

    }),

    it('login returns status 200', async () => {

        const req = {}

        const res = mockResponse();

        await controller.login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

    })

});

describe('user routes', () => {

    let app;
    let request;
    let mockAuth;
    let mockController;

    beforeAll(() => {
        mockAuth = require('../src/middleware/auth');
        mockController = require('../src/user/user.controller');

        jest.spyOn(mockAuth, 'authenticateUser').mockImplementation((req, res, next) => next());
        jest.spyOn(mockAuth, 'authenticateToken').mockImplementation((req, res, next) => next());
        // jest.spyOn(mockController, 'register').mockImplementation((req, res) => res.end());
        jest.spyOn(mockController, 'login').mockImplementation((req, res) => res.end());

        app = require('../app');
        request = require('supertest')(app);
    })

    it.skip('GET request to /api/user/:id should call authenticateToken and get method of controller', async () => {

        await request.get('/api/user/user123');

        expect(mockAuth.authenticateToken).toHaveBeenCalled();
        expect(mockController.get).toHaveBeenCalled();

    })

    it.skip('POST request to /api/user/register should call register method of controller', async () => {

        await request.post('/api/user/register');

        expect(mockController.register).toHaveBeenCalled();

    })

    it('POST request to /api/user/login should call login method of controller', async () => {

        await request.post('/api/user/login');

        expect(mockController.login).toHaveBeenCalled();

    })

})


