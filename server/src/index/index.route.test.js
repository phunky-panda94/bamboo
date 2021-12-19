const request = require('supertest');
const app = require('../../app');

describe('index routes', () => {

    it('GET request for index', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).to.equal(200);
    });

});
