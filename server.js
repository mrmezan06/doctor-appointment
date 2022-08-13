const express = require('express');

const app = express();
require('dotenv').config();
const path = require('path');

// DB Connection
const dbConfig = require('./config/dbConfig');

// Route Call
app.use(express.json());
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const doctorRoute = require('./routes/doctorRoute');
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/doctor', doctorRoute);

/* Heroku Configuration */
if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    } );
}

const port = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('Hello World!'));

/* End of Heroku Configuration */


app.listen(port, () => console.log(`Node server started at port ${port}`));