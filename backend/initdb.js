const sqlite3 = require("sqlite3").verbose();
const isEmpty = require("is-empty");
const courses = require("./text/courses");

let db = new sqlite3.Database("test.db", err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to sqlite3 initdb database");
  console.log("seeding data");
  seedData
    .then(() => {
      console.log("Seed Success!");
    })
    .catch(err => {
      console.log("Seed Fail!");
      console.log(err);
    });
});

const seedData = new Promise(resolve => {
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
        date_joined TEXT,
        last_login TEXT,
        check(rank in (1,2,3))
    );
    
    CREATE TABLE IF NOT EXISTS courses ( 
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        code VARCHAR(10) NOT NULL,
        unique (code)
    );

    CREATE TABLE IF NOT EXISTS courseInstance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code VARCHAR(10) NOT NULL,
        term VARCHAR(6) NOT NULL,
          FOREIGN KEY (code) REFERENCES courses(code),
          FOREIGN KEY (term) REFERENCES term(term),
          unique (code, term)
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
    `;

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
        console.log(err);
      }
    });

    db.run(insert_query, ranks, function(err) {
      if (err) {
        console.log(err);
      }
    });

    terms.forEach(entry => {
      db.serialize(() => {
        db.run(
          `INSERT OR IGNORE INTO term (term, active) VALUES (?, ?)`,
          entry,
          function(err) {
            if (err) {
              console.log(err);
            }
          }
        );
      });
    });
  });

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

        /*       db.run(
        `INSERT OR IGNORE INTO courses (code, name) VALUES (?,?)`,
        [entry.code, entry.name],
        err => {
          if (err) {
            console.log(err);
          }
        }
      ); */

        /*       db.run(
        `INSERT OR IGNORE INTO courseInstance (code, term) VALUES (?, ?)`,
        [entry.code, terms[0][0]],
        err => {
          if (err) {
            console.log(err);
          }
        }
      );
      db.run(
        `INSERT OR IGNORE INTO courseInstance (code, term) VALUES (?, ?)`,
        [entry.code, terms[1][0]],
        err => {
          if (err) {
            console.log(err);
          }
        }
      );
      db.run(
        `INSERT OR IGNORE INTO courseInstance (code, term) VALUES (?, ?)`,
        [entry.code, terms[2][0]],
        err => {
          if (err) {
            console.log(err);
          }
        }
      ); */
      });
    });
    db.run("commit");
    courseEntry.finalize();
    courseInstanceEntry.finalize();
    db.close(err => {
      if (err) {
        console.error("seeding screwed up");
        console.error(err);
      } else {
        resolve();
      }
    });
  });
});

module.exports = seedData;
