const { authenticateToken, authenticateUser } = require('../src/auth/auth');

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

        

    })

})

describe('authenticate token', () => {

    it('should return an error if the token is null', () => {
        
    })

    it('should return an error if token cannot be authenticated', () => {

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