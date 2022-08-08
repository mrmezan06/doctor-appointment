const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL);

const connection = mongoose.connection;

connection.on('connected', () => {
    console.log('MongoDB Connection is Successful');
});

connection.on('error', (err) => {
    console.log('MongoDb connection error: ' + err);
});

module.exports = mongoose;