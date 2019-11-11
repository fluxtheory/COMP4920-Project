const bcrypt = require("bcryptjs");
const getdb = require("./db").getDb;
const groupdb = require("./groupDB");

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
        if (err) {
          reject(err.message);
        } else {
          (this.lastID) ? resolve(true) : resolve(false);
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
          reject(err.message);
        }

        (this.changes) ? resolve(true) : resolve(false);
          
      });
    });
  },


  deleteUser: function(user) {
    return new Promise((resolve, reject) => {
      let sql = `DELETE FROM users WHERE username = ?`;
      db.run(sql, user, function(err){
        if (err) {
          reject(err.message);
        }

        if(this.changes){ 
          db.run(`DELETE FROM userCourses WHERE username = ?`, user);
          db.run(`DELETE FROM userFriends WHERE userid = ? OR friendid = ?`, [user, user]);
          db.run(`DELETE FROM groupUsers WHERE username = ?`, user);
          db.run(`UPDATE forumPosts SET userId = ? WHERE userId = ?` [null, user]);
          groupdb.deleteUser(user);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  },

  updateUser: function(updates){
    return new Promise((resolve, reject) => {
      //console.log(user, updates);
      if(updates.last_login){
        db.run(`UPDATE users SET last_login=? WHERE username=?`, [updates.last_login, updates.username], err => {
          if(err){
            reject(err.message);
          } else {
            resolve(true);
          }
        });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(updates.new_password, salt, (err, hash) => {
            if (err) {
              reject(err.message);
            }
            let sql = `UPDATE users SET password=?, email = ? WHERE username=?`;
            db.run(sql, [hash, updates.new_email, updates.username], function(err){
              if(err){
                reject(err.message);
              } 
              (this.changes) ? resolve(true) : resolve(false);
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
            reject(err.message);
          } 
          (this.changes) ? resolve(true) : resolve(false);
        });
      } else {
        reject(username + " Or " + friendname + " is not a valid userid!");
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
              reject(err.message);
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
              reject(err.message);
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
        let sql = `SELECT code FROM courseInstance
                  LEFT JOIN userCourses on
                  courseInstance.id = userCourses.courseInstance 
                  WHERE username = ? 
                  AND term = (SELECT term from term WHERE active);`;
        db.all(sql, user, (err, rows) => {
          if(err){
            reject(err.message);
          } else {
            resolve(rows);
          }
        });
    });
  }
};
