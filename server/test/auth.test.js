const { authenticateToken, authenticateUser, createToken } = require('../src/auth/auth');
const User = require('../src/user/user.model');
const { response } = require('express');
// memory database
const database = require('../util/memoryDatabase');

// mocks
const mockRequest = (headers, body) => {
    return {
        headers: headers,
        body: body
    }
}

const mockResponse = () => {
    return {
        status: jest.fn().mockReturnValue({}),
        json: jest.fn().mockReturnValue({})
    }
}

const next = jest.fn();

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

    it('should return error if no token in header', () => {
        
        const expectedResponse = { error: 'No token in Authorization header' };
        const req = mockRequest({}, {});
        const res = mockResponse();

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(expectedResponse);

    })

    it('should return error if invalid token in header', () => {

        const expectedResponse = { error: 'Unauthorized' };
        const req = mockRequest({ authorization: 'Bearer abc' }, {});
        const res = mockResponse();

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(expectedResponse);

    })

    it('should return called next function if token is valid', () => {

        const token = createToken('email');
        const req = mockRequest({ authorization: `Bearer ${token}` }, {});
        const res = mockResponse();

        authenticateToken(req, res, next);

        expect(next).toHaveBeenCalled();

    })


})

describe('authenticate user',  () => {

    it('should call next function if user found with matching credentials', async () => {

        const email = 'bwayne@wayne.com'
        const password = 'batman'

        const req = mockRequest({}, {
            email: email,
            password: password
        })

        const res = mockResponse();

        await authenticateUser(req, res, next);

        expect(next).toHaveBeenCalled();

    })
    
    it('should return error if no user found with matching credentials', async () => {

        const email = 'random@email.com'
        const password = 'password'

        const req = mockRequest({},{
            email: email,
            password: password
        })

        const res = mockResponse();

        await authenticateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials'});

    })

    it('should return error if invalid password provided', async () => {

        const email = 'bwayne@wayne.com';
        const password = 'invalid';

        const req = mockRequest({},{
            email: email,
            password: password
        })

        const res = mockResponse();

        await authenticateUser(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials'});


    })

})