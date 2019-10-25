//const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const session = require('express-session');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require("passport");

const users = require("./routes/api/registerLogin");
const initdb = require("./initdb");
const courses = require("./routes/api/course");

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));


initdb();
app.use(passport.initialize());
require("./config/passport");

// append /api for our http requests
app.use('/api/users', users);
app.use('/api/courses', courses);

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));