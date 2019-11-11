//const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const session = require('express-session');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require("passport");

const users = require("./routes/user.route");
const initdb = require("./db").initDb;
const keys = require("./config/keys");
const courses = require("./routes/course");
const groups = require("./routes/group");
const feed = require("./routes/feed");
const Chatkit = require('@pusher/chatkit-server');


const API_PORT = 3001;
const app = express();
app.use(cors());


// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));


//initdb();

app.use(session({secret: keys.secret, cookie: { maxAge: 60000}, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

const chatkit = new Chatkit.default({
    instanceLocator: 'v1:us1:4c1776d3-a51e-497e-8f3e-0a9f08eabf77',
    key: '9cc4a113-e6f1-4109-92f9-799391e959c5:NBzZCZrvWUf1bdIblQR56oGOiELvMsfJq2nyFvR6Jg0=', // This is bad, use .env vars
  })

//const allCourses = require('./text/courses.json');

// chatkit.createRoom({
//     id: 'allChat',
//     creatorId: 'root',
//     name: 'All Chat',
//     customData: { foo: 42 },
//   })
//     .then(() => {
//       console.log('Room cr eated successfully');
//     }).catch((err) => {
//       console.log(err);
//     });
/*
chatkit.addUsersToRoom(
    {
        roomId: 'allChat',
        userIds: ['jordan', 'xavier', 'aashwin']
    }
)
    .then(() => {
        console.log('users added successfully');
    }).catch((err) => {
        console.log(err);
    });
*/

// append /api for our http requests
app.use('/', users);
app.use('/', groups);
app.use('/', courses);
app.use('/', feed);


// launch our backend into a port
initdb(err => {
    app.listen(API_PORT, () => {
        console.log(`LISTENING ON PORT ${API_PORT}`)
    });
})
