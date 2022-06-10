const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

/**
 * Importing all the routes from ./routes
 */
const authRoute = require('./routes/auth.routes');
const miscRoute = require('./routes/misc.routes');

const app = express();
dotenv.config();
const log = console.log;

mongoose.connect(process.env.DB_CONNECT, function(){
    log('Connected to DB');
});

app.use(morgan('short'));
app.use(express.json());
app.use('/api/users',authRoute);
app.use('/api/misc', miscRoute);

app.listen(3000, function(){
    log('Listening to PORT -> 3000');
});