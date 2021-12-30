describe('encrypt password', () => {

    const { encryptPassword, checkPassword } = require('../../src/middleware/authenticator');
    const next = jest.fn();

    it('should encrypt password in request body and call next', async () => {

        const password = 'abcd';
        const req = { body: { password: password } };
        const res = {}

        await encryptPassword(req, res, next);

        expect(req.body.password).not.toBe(password);

        const match = await checkPassword(password, req.body.password);

        expect(match).toBeTruthy();
        expect(next).toHaveBeenCalled();

    })

})

describe('create token', () => {

    const { createToken } = require('../../src/middleware/authenticator');

    it('returns a json web token', () => {

        const email = 'example@email.com';
        const token = createToken(email);

        const components = token.split('.');

        expect(components.length).toEqual(3);

    })

})

describe('authenticate token', () => {

    const { authenticateToken, createToken } = require('../../src/middleware/authenticator');
    const next = jest.fn();
    const mockResponse = () => {
        return {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        }
    }

    it('should return error if no token in header', () => {
        
        const expectedResponse = { error: 'No token in Authorization header' };
        const req = { headers: {} }
        const res = mockResponse();

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expectedResponse);

    })

    it('should return error if invalid token in header', () => {

        const expectedResponse = { error: 'Unauthorized' };
        const req = { headers: { authorization: 'Bearer abc' } };
        const res = mockResponse();

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(expectedResponse);

    })

    it('should return called next function if token is valid', () => {

        const token = createToken('email');
        const req = { headers: { authorization: `Bearer ${token}` } };
        const res = mockResponse();

        authenticateToken(req, res, next);

        expect(next).toHaveBeenCalled();

    })


})

describe('authenticate user',  () => {

    const { authenticateUser } = require('../../src/middleware/authenticator');
    const next = jest.fn();
    const mockResponse = () => {
        return {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnValue({})
        }
    }

    const database = require('../../util/memoryDatabase');

    beforeAll(async () => { 
        await database.connect();
        await database.seed();
    });

    afterAll(async () => database.disconnect());

    it('should add user and token and call next function if user found with matching credentials', async () => {

        const email = 'bwayne@wayne.com'
        const password = 'batman'

        const user = {
            firstName: 'Bruce',
            lastName: 'Wayne'
        }

        const req = { 
            body: {
                email: email,
                password: password
            }
        }

        const res = mockResponse();

        await authenticateUser(req, res, next);

        expect(req.body.user).toBeTruthy();
        expect(req.body.user).toHaveProperty('firstName');
        expect(req.body.user).toHaveProperty('lastName');
        expect(req.body.token).toBeTruthy();
        expect(next).toHaveBeenCalled();

    })
    
    it('should return error if no user found with matching credentials', async () => {

        const email = 'random@email.com'
        const password = 'password'

        const req = {
            body: {
                email: email,
                password: password
            }
        }

        const res = mockResponse();

        await authenticateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'invalid credentials'});

    })

    it('should return error if invalid password provided', async () => {

        const email = 'bwayne@wayne.com';
        const password = 'invalid';

        const req = {
            body: {
                email: email,
                password: password
            }
        }

        const res = mockResponse();

        await authenticateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'invalid credentials'});


    })

})