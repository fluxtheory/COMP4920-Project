const sqlite3 = require("sqlite3").verbose();
const isEmpty = require("is-empty");
const bcrypt = require("bcryptjs");

let db = new sqlite3.Database("test.db", err => {
  if (err) {
    return console.error(err.message);
  }
  //console.log("Connected to sqlite3 database");
});

module.exports = {
  addUser: function addUser(user) {
    return new Promise((resolve, reject) => {
      let username = user.username;
      let email = user.email;
      let password = user.password;
      let date_joined = new Date().toString();
      let errors = {};

      let query = `INSERT INTO users (username, password, email, zid, rank, date_joined) VALUES(?, ?, ?, ?, ?, ?)`;
      db.run(query, [username, password, email, null, 3, date_joined], function(err) {
        if (err) {
          //console.log(err.message);
          reject(err.message);
        } else {
          resolve(true);
        }
      });
    });
  },


  deleteUser: function(user) {
    return new Promise((resolve, reject) => {
      db.run(`DELETE FROM users WHERE username = ?`, user, function(err) {
        if (err) {
          reject(err);
        }
        if( `${this.changes}` > 0){
          db.run(`DELETE FROM userCourses WHERE username = ?`, user);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },

  updateUser: function(updates){
    return new Promise((resolve, reject) => {

      // will assume the user already exists, otherwise this function would never even be called.
      //console.log(updates);

      if(updates.last_login){
        //console.log("Updating last login");
        db.run(`UPDATE users SET last_login=? WHERE username=?`, [updates.last_login, updates.username], err => {
          if(err){
            reject(err);
          } else {
            resolve(true);
          }
        });
      }

      if(updates.new_password){
        
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(updates.new_password, salt, (err, hash) => {
            if (err) {
              console.log(err);
              return res.status(500).json(err);
            }
            //console.log("Updating password to " + hash);
            db.run(`UPDATE users SET password=? WHERE username=?`, [hash, updates.username], err => {
              if(err){
                reject(err);
              } else {
                resolve(true);
              }
            });    
          })
        })
      } 

      if(updates.new_email){
        //console.log("Updating email" );
        db.run(`UPDATE users SET email=? WHERE username=?`, [updates.new_email, updates.username], err => {
          if(err){
            reject(err);
          } else {
            resolve(true);
          }
        });
      }

      if(updates.new_rank){
        //console.log("Updating rank");
        db.run(`UPDATE users SET rank=? WHERE username=?`, [updates.new_rank, updates.username], err => {
          if(err){
            reject(err);
          } else {
            resolve(true);
          }
        });
      }
    });
  },



  userExists: function userExists(identifier) {
    return new Promise((resolve, reject) => {
      if (identifier.includes("@")) {
        db.get(
          `SELECT * FROM users where email = ?`,
          identifier,
          (err, row) => {
            if (err) {
              console.log(err.message);
              reject(err);
            } else {
              resolve(row);
            }
          }
        );
      } else {
        db.get(
          `SELECT * FROM users where username = ?`,
          identifier,
          (err, row) => {
            if (err) {
              console.log(err.message);
              reject(err);
            } else {
              resolve(row);
            }
          }
        );
      }
    });
  },

  // returns all the courses enrolled by a user during the current term
  userCourses: function(user){
    return new Promise((resolve,reject) => {
        // I want all COURSES enrolled by a USER during the current TERM
        
        db.all(`SELECT code FROM courseInstance
                LEFT JOIN userCourses on
                courseInstance.id = userCourses.courseInstance 
                WHERE username = ? 
                AND term = (SELECT term from term WHERE active);`, user, (err, rows) => {
          if(err){
            reject(err);
          } else {
            resolve(rows);
          }
        });
    });
  }
};
