const { authenticateToken, authenticateUser, createToken } = require('../src/auth/auth');
const { JsonWebTokenError } = require('jsonwebtoken');

const User = require('../src/user/user.model');

// memory database
const database = require('../util/memoryDatabase');

beforeAll(async () => { 
    await database.connect();
    await database.seed();
 });

afterAll(async () => database.disconnect());

describe('create token', () => {

    it('returns a json web token', () => {

        const email = 'example@email.com';
        const token = createToken(email);

        const components = token.split('.');

        expect(components.length).toEqual(3);

    })

})

describe('authenticate token', () => {

    it('should return an error if the token is undefined', () => {
        
    })

    it.only('should return an error if token cannot be authenticated', () => {

        const token = 'abcd.1234.qwer';
        
        try {
            authenticateToken(token);
        } catch (err) {
            expect(err).toEqual(new JsonWebTokenError('invalid token'));

        }
        
    })

})

describe('authenticate user',  () => {

    it('should return true if user found with matching credentials', async () => {

        const email = 'bwayne@wayne.com'
        const password = 'batman'

        expect(await authenticateUser(email, password)).toBeTruthy();

    })
    
    it('should return false no user found with matching credentials', async () => {

        const email = 'random@email.com'
        const password = 'password'

        expect(await authenticateUser(email, password)).toBeFalsy();

    })

})