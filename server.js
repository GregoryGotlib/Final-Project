const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const path = require('path');
const DB = require('./config/keys').mongoURI;
require('./config/passport')(passport);

mongoose.connect(DB,{ useNewUrlParser: true }).then(() => console.log('Connected to mongoDB..')).catch(error => console.log(error));

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use('/api/users',users);
app.use('/api/profile',profile);


const PORT = process.env.PORT || 5000;
app.listen(PORT , ()=> console.log("Server is running on port:" + PORT));