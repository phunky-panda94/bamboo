require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');
const port = process.env.PORT || 8000;

mongoose.connect(`${process.env.DATABASE}/bloghouse`).catch(error => console.log('[ERROR] Unable to connect to database'));
const database = mongoose.connection;

database.on('error', console.error.bind(console, '[ERROR] Unable to connect to database'));
database.once('open', () => console.log('[INFO] Successfully connected to database'));

app.listen(port, () => {
    console.log(`Server started. Listening on port ${port}`);	
});
