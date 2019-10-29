const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("test.db", err => {
    if (err) {
      return console.error(err.message);
    }
    //console.log("Connected to sqlite3 database");
});

module.exports = {

    // adds a course to the courselist
  addCourse: function(code, name){
    let course = [code, name];  
    return new Promise((resolve, reject) => {
        db.run(`INSERT OR IGNORE INTO courses (code, name) VALUES (?, ?)`, course, (err) => {
            if(err){
                reject(err.message);
            } else {
                resolve(true);
            }
        });
    });
  },

  // returns list of courses according to prefix. If none is supplied, returns the entire list.
  getCourses: function(prefix){
      
      return new Promise((resolve, reject) => {
        if(prefix){
            let sql = "select code, name from courses where code like $drivername";
            const params = {$drivername: prefix+'%'};
            db.all(sql, params, (err, rows) => {
                if(err){
                    reject(err.message);
                } else {
                    resolve(rows);
                }
            });
        } else {
            db.all(`SELECT code, name FROM courses`, (err, rows) => {
                if(err){
                    reject(err.message);
                } else {
                    resolve(rows);
                }
            });
        }
      });
  },

  addCourseInstance: function(code, term){
    let courseInstance = [code, term];  
    return new Promise((resolve,reject) => {
        db.run(`INSERT OR IGNORE INTO courseInstance (code, term) VALUES (?, ?)`, courseInstance, (err) => {
            if(err){
                reject(err.message);
            } else {
                resolve(true);
            }
        });
    });
  },

  // adds a user to the CURRENT INSTANCE of a course
  addUsertoCourseInstance: function(user, code){

  },

    // returns all the users enrolled in a courseInstance
  courseUsers: function courseUsers(code, term){
    return new Promise((resolve,reject) => {
      // I want all the USERS enrolled in a courseInstance
      db.all(`SELECT username FROM userCourses LEFT JOIN courseInstance 
      ON userCourses.courseInstance = courseInstance.id 
      WHERE courseInstance.code = ? AND courseInstance.term = ?`, [code, term] , (err, rows) => {
        if(err){
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },

  // returns all the courses enrolled by a user, if semester is not specified then ALL enrollments are returned
  userCourses: function userCourses(user, term){
    return new Promise((resolve,reject) => {
      if(term){
        // I want all COURSES enrolled by a USER during a particular TERM
        db.all(`SELECT code FROM courseInstance LEFT JOIN userCourses
        ON userCourses.courseInstance = courseInstance.Id where userCourses.username = ? and courseInstance.term = ?`, [user, term], (err, rows) => {
          if(err){
            reject(err);
          } else {
            resolve(rows);
          }
        });
      } else {
        // I want the all COURSES enrolled by a USER
        db.all(`SELECT code from courseInstance LEFT JOIN userCourses
        ON userCourses.courseInstance = courseInstance.Id where userCourses.username = ?`, user, (err, rows) => {
          if(err){
            reject(err);
          } else {
            resolve(rows);
          }
        });
      }
    });
  }
}