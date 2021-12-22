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

    it('should return false if the token is undefined', () => {
      
        const token = undefined;
        const valid = authenticateToken(token);

        expect(valid).toBeFalsy();

    })

    it('should return false if token cannot be authenticated', () => {

        const token = 'abcd.1234.qwer';
        const valid = authenticateToken(token);

        expect(valid).toBeFalsy();
        
    })

    it('should return true if token is valid', () => {

        const token = createToken('batman');
        const valid = authenticateToken(token);

        expect(valid).toBeTruthy();

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