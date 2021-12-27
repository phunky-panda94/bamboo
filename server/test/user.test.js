// route test dependencies
const { checkPassword } = require('../src/middleware/auth');

// model test dependencies
const User = require('../src/user/user.model');
const faker = require('faker');

// mocks
const mockResponse = () => {
    return {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    }
}

// memory database
const database = require('../util/memoryDatabase');

beforeAll(async () => await database.connect());

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

    const controller = require('../src/user/user.controller');
    const mockAuth = require('../src/middleware/auth');

    jest.spyOn(auth, 'encryptPassword').mockImplementation(() => { return 'encrypted password' })

    describe.skip('validate', () => {

        it('POST request to register returns status 400 and errors if validation errors', async () => {
        
            const newUser = {
                firstName: '',
                lastName: '',
                email: 'abc',
                password: ''
            }

            const req = { 
                body: newUser
            }

            const res = mockResponse();

            await controller.register(req, res);
    
            expect(res.status).toBe(400);
            expect(res.body.errors[0].param).toBe('firstName')
            expect(res.body.errors[1].param).toBe('lastName')
            expect(res.body.errors[2].param).toBe('email')
            expect(res.body.errors[3].param).toBe('password')
            
        })

    })

    it('register with return status 200 and message', async () => {
        
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
        
        expect(res.status).toHaveBeenCalledWith(201);
        expect(mockAuth.encryptPassword).toHaveBeenCalled();

    }),

    it('login returns status 200', async () => {

        const user = {
            firstName: 'Bruce',
            lastName: 'Wayne'
        }

        const response = await request
            .post('/api/user/login')
            .send({
                email: 'bwayne@wayne.com',
                password: 'batman'
            })

        expect(response.statusCode).toBe(200);

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


