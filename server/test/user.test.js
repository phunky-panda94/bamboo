const app = require('../app');

// route test dependencies
const request = require('supertest')(app);
const { checkPassword } = require('../src/auth/auth');

// model test dependencies
const User = require('../src/user/user.model');
const faker = require('faker');

// memory database
const database = require('../util/memoryDatabase');

beforeAll(async () => database.connect());

afterAll(async () => database.disconnect());

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

describe('user routes & controllers', () => {

    describe('register', () => {

        it('POST request to register returns status 400 and errors if validation errors', async () => {
        
            const newUser = {
                firstName: '',
                lastName: '',
                email: 'abc',
                password: ''
            }
    
            const response = await request
                .post('/user/register')
                .send(newUser);
    
            expect(response.statusCode).toBe(400);
            expect(response.body.errors[0].param).toBe('firstName')
            expect(response.body.errors[1].param).toBe('lastName')
            expect(response.body.errors[2].param).toBe('email')
            expect(response.body.errors[3].param).toBe('password')
            
        })
    
        it('POST request to register with valid input to return status code 200 and message', async () => {
            
            const newUser = {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password()
            }
    
            const response = await request
                .post('/user/register')
                .send(newUser);
            
            expect(response.statusCode).toBe(201);
            expect(response.body).toBe('New user successfully registered');
    
        }),
    
        it('POST request to register with valid input saves new user to database', async () => {
            
            const newUser = {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password()
            }
    
            await request
                .post('/user/register')
                .send(newUser);
            
            const savedUser = await User.findOne({ 
                firstName: newUser.firstName,
                lastName: newUser.lastName, 
                email: newUser.email.toLowerCase() 
            });
    
            expect(savedUser).toBeTruthy();
            expect(savedUser.firstName).toBe(newUser.firstName);
            expect(savedUser.lastName).toBe(newUser.lastName);
    
        })
    
        it('POST request to register with valid input saves encrypted password to database', async () => {
    
            const newUser = {
                firstName: faker.name.firstName(),
                lastName: faker.name.lastName(),
                email: faker.internet.email(),
                password: faker.internet.password()
            }
    
            await request
                .post('/user/register')
                .send(newUser);
    
            const savedUser = await User.findOne({ 
                firstName: newUser.firstName,
                lastName: newUser.lastName, 
                email: newUser.email.toLowerCase() 
            });
    
            const match = await checkPassword(newUser.password, savedUser.password);
    
            expect(match).toBeTruthy();
    
        })

    })

    describe('login', () => {

        beforeAll(async () => database.seed());

        it('POST request to login with correct credentials returns status 200', async () => {
      
            const response = await request
                .post('/user/login')
                .send({
                    email: 'bwayne@wayne.com',
                    password: 'batman'
                })

            expect(response.statusCode).toBe(200);
            expect(response.body).toBe('successfully logged in');
    
        })

        it('POST request to login with incorrect credentials returns status 401', async () => {

            const response = await request
                .post('/user/login')
                .send({
                    email: 'random@email.com',
                    password: 'password'
                })

            expect(response.statusCode).toBe(401);
            expect(response.body).toBe('unauthorised');

        })
    
        it('POST request to login with incorrect password returns status 401', async () => {

            const response = await request
                .post('/user/login')
                .send({
                    email: 'bwayne@wayne.com',
                    password: 'password'
                })

            expect(response.statusCode).toBe(401);
            expect(response.body).toBe('unauthorised');

        })

    })

});


