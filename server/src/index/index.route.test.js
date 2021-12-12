const request = require('supertest');
const express = require('express');
const indexRoutes = require('./index.route');

const server = express();

server.use('/', indexRoutes);

describe('index routes', async () => {

    test('GET request for index', () => {
        const response = await request(server).get('/');
        expect(response.statusCode).toBe(200);
    });

});
