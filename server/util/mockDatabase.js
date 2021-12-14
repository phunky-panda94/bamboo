const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mockDatabase = new MongoMemoryServer();

exports.connectMockDatabase = async () => {

    const uri = await mockDatabase.getUri();

    const options = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    };

    await mongoose.connect(uri, options);

}

exports.disconnectMockDatabase = async () => {

    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mockDatabase.stop();

}