const sqlite3 = require("sqlite3").verbose();
const isEmpty = require("is-empty");

let db = new sqlite3.Database("test.db", err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to sqlite3 initdb database");
});

module.exports = () => {
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
        rank TEXT,
        date_joined TEXT,
        last_login TEXT,
          FOREIGN KEY (rank) REFERENCES userrank(id)
    );
    
    CREATE TABLE IF NOT EXISTS courses ( 
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        code VARCHAR(10) NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS courseInstance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code VARCHAR(10) NOT NULL,
        term VARCHAR(4),
          FOREIGN KEY (code) REFERENCES courses(code)
    );
    
    CREATE TABLE IF NOT EXISTS userCourses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      courseInstance INTEGER NOT NULL,
        FOREIGN KEY (username) REFERENCES users(username),
        FOREIGN KEY (courseInstance) REFERENCES courseInstance(id)
    );
    ` 
  
    let ranks = ["Course Moderator", "Course Helper", "Member"];
    let placeholders = ranks.map((ranks) => '(?)').join(',');
    let insert_query = `INSERT INTO userrank (name) VALUES ` + placeholders;
    console.log(insert_query);
  
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