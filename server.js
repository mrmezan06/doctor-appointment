const express = require('express');

const app = express();
require('dotenv').config();

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

const port = process.env.PORT || 5000;

// console.log(process.env.MONGO_URL);

app.listen(port, () => console.log(`Node server started at port ${port}`));