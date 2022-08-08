const express = require('express');

const app = express();
require('dotenv').config();

// DB Connection
const dbConfig = require('./config/dbConfig');

// Route Call
app.use(express.json());
const userRoute = require('./routes/userRoute');
app.use('/api/user', userRoute);

const port = process.env.PORT || 5000;

// console.log(process.env.MONGO_URL);

app.listen(port, () => console.log(`Node server started at port ${port}`));