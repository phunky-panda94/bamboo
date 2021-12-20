const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const faker = require('faker');
const User = require('../src/user/user.model');
const { encryptPassword } = require('../src/auth/auth');

let database;

exports.connect = async () => {
    database = await MongoMemoryServer.create();
    const uri = database.getUri();
    await mongoose.connect(uri);
}

exports.disconnect = async () => {
    await mongoose.connection.db.dropDatabase();
    await mongoose.disconnect();
    await database.stop();
}

exports.seed = async () => {

    const encryptedPassword = await encryptPassword('batman');

    const user = new User({
        firstName: 'Bruce',
        lastName: 'Wayne',
        email: 'bwayne@wayne.com',
        password: encryptedPassword
    });

    await user.save();

}