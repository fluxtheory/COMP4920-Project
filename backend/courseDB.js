const sqlite3 = require("sqlite3").verbose();
const userdb = require("./usersDB");

let db = new sqlite3.Database("test.db", err => {
  if (err) {
    return console.error(err.message);
  }
  //console.log("Connected to sqlite3 database");
});

module.exports = {
  // adds a course to the courselist
  addCourse: function(code, name) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO courses (code, name) VALUES (?, ?)`,
        [code, name],
        err => {
          if (err) {
            reject({ error: "Course already exists!" });
          }
          this.addCourseInstance(code, new Date().getFullYear() + "T1");
          this.addCourseInstance(code, new Date().getFullYear() + "T2");
          this.addCourseInstance(code, new Date().getFullYear() + "T3");
          resolve(true);
        }
      );
    });
  },

  // returns list of courses according to prefix. If none is supplied, returns the entire list.
  getCourses: function(prefix) {
    return new Promise((resolve, reject) => {
      if (prefix) {
        let sql = "select code, name from courses where code like $drivername";
        const params = { $drivername: prefix + "%" };
        db.all(sql, params, (err, rows) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(rows);
          }
        });
      } else {
        db.all(`SELECT code, name FROM courses`, (err, rows) => {
          if (err) {
            reject(err.message);
          } else {
            resolve(rows);
          }
        });
      }
    });
  },

  addCourseInstance: function(code, term) {
    let courseInstance = [code, term];
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO courseInstance (code, term) VALUES (?, ?)`,
        courseInstance,
        err => {
          if (err) {
            reject(err.message);
          } else {
            resolve(true);
          }
        }
      );
    });
  },

  // enrolls a user to the CURRENT INSTANCE of a course
  // SHOULD WE IMPLEMENT A LIMIT to how many courses a user can sign up for per semester?
  addUsertoCourseInstance: function(user, code) {
    return new Promise((resolve, reject) => {

      userdb.userExists(user).then(user => {
        if(!user){
          reject("User does not exist!");
        } else {
          db.run(
            `INSERT INTO userCourses (username, courseInstance) VALUES
            (?, (select id from courseInstance where term = (SELECT term from term WHERE active) AND code = ?))`,
            [user, code],
            err => {
              if (err) {
                reject(err.message);
              } else {
                resolve(true);
              }
            }
          );
        }
      }).catch(err => {
        if(err){
          reject(err);
        }
      });
    });
  },

  // returns all the users AND THEIR EMAILS enrolled in a courseInstance
  courseUsers: function(code) {
    return new Promise((resolve, reject) => {
      // I want all the USERS enrolled in the current course instance
      db.all(
        `SELECT * from userCourses
      LEFT JOIN courseInstance ON 
      userCourses.courseInstance = courseInstance.id
      where code = ? AND term = (SELECT term from term WHERE active);`,
        code,
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
};
