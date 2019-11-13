const sqlite3 = require("sqlite3").verbose();
const assert = require("assert");
const courses = require("./text/courses");
//const coursedb = require("./courseDB");
let db;

// refactoring so we only have a single database access script.

module.exports = {
    getDb, //returns a connected database
    initDb //initializes database and makes sure it is ready for use.
};

function initDb(callback){
    if(db){
        console.warn("Attempting to init DB again!");
        return callback(null, db);
    }
}

db = new sqlite3.Database("test.db", err => {
  if (err) {
    return console.error(err.message);
  }
  //console.log("Connected to sqlite3 initdb database");
      
  let schema_query = `CREATE TABLE IF NOT EXISTS userrank (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  );

  CREATE TABLE IF NOT EXISTS users ( 
    username TEXT PRIMARY KEY, 
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE, 
    zid TEXT UNIQUE, 
    chatkitid TEXT UNIQUE,
    rank INTEGER REFERENCES userrank,
    date_joined TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_login TEXT DEFAULT NULL,
    karma INTEGER DEFAULT 0,
    check(rank in (1,2,3))
  );

  CREATE TABLE IF NOT EXISTS courses ( 
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    unique (name, code)
  );

  CREATE TABLE IF NOT EXISTS courseInstance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code VARCHAR(10) NOT NULL,
    term VARCHAR(6) NOT NULL,
      FOREIGN KEY (term) REFERENCES term(term),
      unique (code, term)
  );

  CREATE TABLE IF NOT EXISTS courseInstanceDeadlines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cInstanceid INETGER REFERENCES courseInstance,
    title TEXT NOT NULL,
    desc TEXT,
    startdate TIMESTAMP NOT NULL,
    deadline TIMESTAMP NOT NULL,
    unique (cInstanceid, startdate, deadline)
  );

  CREATE TABLE IF NOT EXISTS term (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  term VARCHAR(6) NOT NULL UNIQUE,
  active BOOLEAN NOT NULL
  );

  CREATE UNIQUE INDEX IF NOT EXISTS active_term ON term(term) WHERE active;

  CREATE TABLE IF NOT EXISTS userCourses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  courseInstance INTEGER NOT NULL REFERENCES courseInstance,
    FOREIGN KEY (username) REFERENCES users(username),
    unique (username, courseInstance)
  );

  CREATE TABLE IF NOT EXISTS groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  courseInstance INTEGER REFERENCES courseInstance,
  owner TEXT NOT NULL,
  FOREIGN KEY (owner) REFERENCES users(username),
  unique (name, courseInstance)
  );

  CREATE TABLE IF NOT EXISTS groupUsers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  groupid INTEGER NOT NULL REFERENCES groups,
  username TEXT NOT NULL,
  unique(groupid, username)
  );

  CREATE TABLE IF NOT EXISTS forumPosts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  courseInstanceId INTEGER NOT NULL REFERENCES courseInstance,
  parentId INTEGER REFERENCES forumPosts,
  userId INTEGER REFERENCES users,
  kudos INTEGER DEFAULT 0,
  datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  postContent TEXT NOT NULL,
  sticky BOOLEAN DEFAULT 0 NOT NULL 
  );

  CREATE TABLE IF NOT EXISTS userFriends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userid TEXT REFERENCES users NOT NULL,
    friendid TEXT REFERENCES users NOT NULL,
    unique(userid, friendid)
  );`;

  // do we need both topicId and parentId??

  let ranks = ["Course Moderator", "Course Helper", "Member"];
  let placeholders = ranks.map(ranks => "(?)").join(",");
  let insert_query =
  `INSERT OR IGNORE INTO userrank (name) VALUES ` + placeholders;

  let year = new Date().getFullYear();
  let monthNow = new Date().getMonth();
  let terms = [
    [year + "T1", monthNow <= 5],
    [year + "T2", monthNow <= 8 && monthNow > 5],
    [year + "T3", monthNow <= 12 && monthNow > 8]
  ];

  db.serialize(() => {
    db.exec(schema_query, function(err) {
      if (err) {
        console.log(err.message);
      }
    });
  
    db.run(insert_query, ranks, function(err) {
      if (err) {
        console.log(err.message);
      }
    });
  
    terms.forEach(entry => {
      db.run(
        `INSERT OR IGNORE INTO term (term, active) VALUES (?, ?)`,
        entry,
        function(err) {
          if (err) {
            console.log(err.message);
          }
        }
      );
    });
    /*
    db.serialize(() => {
      db.run("begin transaction");
      const courseEntry = db.prepare(
        `INSERT OR IGNORE INTO courses (code, name) VALUES (?,?)`,
        err => {
          if (err) {
            console.log(err);
          }
        }
      );
  
      const courseInstanceEntry = db.prepare(
        `INSERT OR IGNORE INTO courseInstance (code, term) VALUES (?, ?)`,
        err => {
          if (err) {
            console.log(err);
          }
        }
      );
      courses.forEach(entry => {
        db.serialize(() => {
          // BATCH INSERT THIS!
          courseEntry.run(entry.code, entry.name); // replace with a `foreach` around your data
          courseInstanceEntry.run(terms[0][0]);
          courseInstanceEntry.run(terms[1][0]);
          courseInstanceEntry.run(terms[2][0]);
          console.log("Success, course: ", entry.code);
        });
      });
      db.run("commit");
      courseEntry.finalize();
      courseInstanceEntry.finalize();
    });*/
  });
});



function connected(err, _db){
    if(err){
        return callback(err);
    }
    console.log("DB initialized");
    db = _db;
    return callback(null, db);
}

function getDb(){
    assert.ok(db, "Db has not been initialized.");
    return db;
}