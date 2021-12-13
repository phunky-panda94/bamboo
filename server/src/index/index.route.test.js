const expect = require('chai').expect
const request = require('supertest');
const express = require('express');
const indexRoutes = require('./index.route');

const server = express();

server.use('/', indexRoutes);

describe('index routes', () => {

    it('GET request for index', async () => {
        const response = await request(server).get('/');
        expect(response.statusCode).to.equal(200);
    });

});
