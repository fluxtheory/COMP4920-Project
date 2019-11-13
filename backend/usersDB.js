const bcrypt = require("bcryptjs");
const getdb = require("./db").getDb;
const groupdb = require("./groupDB");
const isEmpty = require("is-empty");

let db = getdb();

module.exports = {
  addUser: function addUser(user) {
    return new Promise((resolve, reject) => {
      let username = user.username;
      let email = (username.includes("@")) ? username : user.email;
      let password = user.password;
      let date_joined = new Date().toString();
      
      let query = `INSERT INTO users (username, password, email, zid, rank, date_joined) VALUES(?, ?, ?, ?, ?, ?)`;
      db.run(query, [username, password, email, null, 3, date_joined], function(err) {
        if(err) {
          reject({code: 400, msg: err.message});
        } else {
          (this.lastID) 
            ? resolve({code: 200, msg: "OK"}) 
            : resolve({code: 503, msg: "Not available at this time"});
        }
      });
    });
  },

  //gives user moderator privileges
  promoteUser: function (username, rank){
    return new Promise((resolve, reject) => {
      let sql = `UPDATE users SET rank = ? WHERE username = ?`;
      db.run(sql, [rank, username], function(err){
        if(err){
          reject({code: 500, msg: err.message});
        }
        (this.changes) 
          ? resolve({code: 200, msg: "OK"}) 
          : resolve({code: 404, msg: "User not found"});
      });
    });
  },


  deleteUser: function(user) {
    return new Promise((resolve, reject) => {
      let sql = `DELETE FROM users WHERE username = ?`;
      db.run(sql, user, function(err){
        if (err) {
          reject({code: 500, msg: err.message});
        }

        if(this.changes){ 
          // unenrol users from courses
          db.run(`DELETE FROM userCourses WHERE username = ?`, user).catch(err => { console.log(err.message)});
          // remove friend listings
          db.run(`DELETE FROM userFriends WHERE userid = ? OR friendid = ?`, [user, user]).catch(err => { console.log(err.message)});
          // remove user from any existing groups
          db.run(`DELETE FROM groupUsers WHERE username = ?`, user).catch(err => { console.log(err.message)});
          // remove post identification but keeping post content.
          db.run(`UPDATE forumPosts SET userId = ? WHERE userId = ?` [null, user]).catch(err => { console.log(err.message)});
          
          resolve({code: 200, msg: "OK"});
        } else {
          resolve({code: 404, msg: "User not found"});
        }
      });
    });
  },

  updateUser: function(updates){
    return new Promise((resolve, reject) => {
      
      if(updates.last_login){
        db.run(`UPDATE users SET last_login=? WHERE username=?`, [updates.last_login, updates.username], err => {
          if(err){
            reject({code: 500, msg: err.message});
          } else {
            resolve({code: 200, msg: "OK"});
          }
        });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(updates.new_password, salt, (err, hash) => {
            if (err) {
              reject({code: 500, msg: err.message});
            }
            let sql = `UPDATE users SET password=?, email = ?, zid=? WHERE username=?`;
            db.run(sql, [hash, updates.new_email, updates.new_zid, updates.username], function(err){
              if(err){
                reject({code: 500, msg: err.message});
              } 
              (this.changes) ? resolve({code: 200, msg: "OK"}) : resolve({code: 404, msg: "User not found"});
            });    
          })
        });
      }
    });
  },

  addFriend: function(username, friendname){
    return new Promise((resolve, reject) => {
      if(this.userExists(username) && this.userExists(friendname)){
        let sql = `INSERT INTO userFriends (userid, friendid) VALUES (?, ?), (?, ?)`;
        db.run(sql, [username, friendname, friendname, username], function(err){
          if(err){
            reject({code: 500, msg: err.message});
          } 
          (this.changes) ? resolve({code: 200, msg: "OK"}) : resolve({code: 400, msg: "Failed to Insert, check your values again"});
        });
      } else {
        resolve({code: 404, msg: "User not found"});
      }
    })
  },

  userExists: function userExists(identifier) {
    return new Promise((resolve, reject) => {
      if (identifier.includes("@")) {
        db.get(
          `SELECT * FROM users where email = ?`,
          identifier,
          (err, row) => {
            if (err) {
              reject({code: 500, msg: err.message});
            } else {
              resolve({success : !isEmpty(row), code: (success) ? 200 : 404, data: row});
            }
          }
        );
      } else {
        db.get(
          `SELECT * FROM users where username = ?`,
          identifier,
          (err, row) => {
            if (err) {
              reject({code: 500, msg: err.message});
            } else {
              resolve({success : !isEmpty(row), code: (success) ? 200 : 404, data: row});
            }
          }
        );
      }
    });
  },

  // returns all the courses enrolled by a user during the current term
  userCourses: function(user){
    return new Promise((resolve,reject) => {
        let sql = `SELECT code FROM courseInstance
                  LEFT JOIN userCourses on
                  courseInstance.id = userCourses.courseInstance 
                  WHERE username = ? 
                  AND term = (SELECT term from term WHERE active);`;
        db.all(sql, user, (err, rows) => {
          if(err){
            reject({code: 500, msg: err.message});
          } else {
            resolve({success : !isEmpty(row), code: (success) ? 200 : 404, data: row, msg: (success) ? "OK" : "Username not found"});
          }
        });
    });
  },

  // minus password of course
  getUserInfo: function(userArray){
    return new Promise((resolve, reject) => {
      
      if(userArray.length == 1){
        db.get(`SELECT email, zid, rank, date_joined, last_login, karma FROM users WHERE username = ?`, userArray[0], (err, row) => {
          if(err){
            reject({code: 500, msg: err.message});
          }
          resolve({success : !isEmpty(row), code: (success) ? 200 : 404, data: row, msg: (success) ? "OK" : "Username(s) not found"});
        })
      }

      //if(userArray.length > 10){
        /*
        var i, j, temparray, chunk = 10;
        for (i=0,j=array.length; i<j; i+=chunk) {
            temparray = array.slice(i,i+chunk);
            // do whatever
        }*/
        //let sql = `SELECT email, zid, rank, date_joined, last_login, karma FROM users WHERE username IN ` + placeholders;
      //} else {
        let placeholders = userArray.map(user => "(?)").join(",");
        let sql = `SELECT email, zid, rank, date_joined, last_login, karma FROM users WHERE username IN ` + placeholders;
        //console.log(sql);
        db.all(sql, userArray, (err, row) => {
          if(err){
            reject({code: 500, msg: err.message});
          }
          let empty = !isEmpty(row);
          resolve({success : empty, code: (empty) ? 200 : 404, msg: (empty) ? "OK" : "Course not in db", data: row});
        })
      //}
    })
  }
};
