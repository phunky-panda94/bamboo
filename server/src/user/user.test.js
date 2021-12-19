const app = require('../../app');

// route test dependencies
const request = require('supertest');

// model test dependencies
const User = require('./user.model');
const faker = require('faker');

// mock database
const { connectMockDatabase, disconnectMockDatabase } = require('../../util/mockDatabase');


describe.skip('user model', () => {
    
    it('should be invalid if first name is empty', () => {
        let newUser = new User();

        newUser.validate(err => {
            expect(err.errors.firstName).to.exist;
        })
    })

    it('should be invalid if last name is empty', () => {
        let newUser = new User();

        newUser.validate(err => {
            expect(err.errors.lastName).to.exist;
        })
    })

    it('should be invalid if email is empty', () => {
        let newUser = new User();

        newUser.validate(err => {
            expect(err.errors.email).to.exist;
        })
    })

    it('should be invalid if password is empty', () => {
        let newUser = new User();

        newUser.validate(err => {
            expect(err.errors.password).to.exist;
        })
    })

    it('virtual fullname method should return first name and last name', () => {
        let newUser = new User({
            firstName: 'John',
            lastName: 'Smith',
            email: 'johnsmith@email.com'
        })

        assert.equal(newUser.fullName, `${newUser.firstName} ${newUser.lastName}`);
    })

})

describe('user routes', () => {

    before(async function() {connectMockDatabase()});
    after(async function() {disconnectMockDatabase()});

    describe('', () => {

        let newUser = {
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }

        it('POST request for register', async () => {
            
            const response = await request(app)
                .post('/register')
                .set('Accept', 'application/json')
                .send(newUser);
 
            expect(response.statusCode).to.equal(201);
            expect(response.body).to.have.string('New user successfully registered');

        }),
    
        it('POST request to login', () => {
            
        })

    })

});