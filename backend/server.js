const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const session = require('express-session');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');

const auth = require('./userAuth');


const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();


let db = new sqlite3.Database('test.db', (err) => {
  if(err){
    return console.error(err.message);
  }
  console.log('Connected to sqlite3 database');
});



// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

// append /api for our http requests
app.use('/api', router);
init();
// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

/*
db.close((err) => {
  if(err) {
    return console.error(err.message);
  }
  console.log('Closed db connection');
});*/


function init() {
  let schema_query = `CREATE TABLE IF NOT EXISTS userrank (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS users ( 
      username TEXT PRIMARY KEY, 
      password TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE, 
      zid TEXT, 
      rank TEXT,
      date_joined TEXT,
      last_login TEXT,
      user_session INTEGER,
        FOREIGN KEY (rank) REFERENCES userrank(id)
  );` 

  let ranks = ["Course Moderator", "Course Helper", "Member"];
  let placeholders = ranks.map((ranks) => '(?)').join(',');
  let insert_query = `INSERT INTO userrank (name) VALUES ` + placeholders;
  //console.log(insert_query);

  db.exec(schema_query, function(err){
    if(err){
      console.log(err.message);
    }
  });

  db.run(insert_query, ranks, function(err) {
    //if(err){
    //  return console.error(err.message);
    //}
    console.log(`Rows inserted ${this.changes}`)
  })
}

function createTestUser(){
  let username = "fluxtheory";
  let password = "testpassword1";
}