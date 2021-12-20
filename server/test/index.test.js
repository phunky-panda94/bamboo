const app = require('../app');
const request = require('supertest');

describe('index routes', () => {

    it('GET request for index', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200);
    });

});
