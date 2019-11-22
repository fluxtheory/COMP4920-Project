const bcrypt = require("bcryptjs");
const getdb = require("./db").getDb;
const groupdb = require("./groupDB");
const isEmpty = require("is-empty");

let db = getdb();

module.exports = {
  addUser: function addUser(user) {
    return new Promise((resolve, reject) => {
      let username = user.username;
      let email = username.includes("@") ? username : user.email;
      let password = user.password;
      let date_joined = new Date().toString();

      let query = `INSERT INTO users (username, password, email, zid, rank, date_joined) VALUES(?, ?, ?, ?, ?, ?)`;
      db.run(query, [username, password, email, null, 3, date_joined], function(
        err
      ) {
        if (err) {
          reject({ code: 400, msg: err.message });
        } else {
          this.lastID
            ? resolve({ code: 200, msg: "OK" })
            : resolve({ code: 503, msg: "Not available at this time" });
        }
      });
    });
  },

  // possibly through a list, with zids most likely.
  addUsers: function(userArray) {},

  toggleKarma: function(user, giver_user){
    return new Promise((resolve, reject) => {
      db.get(`SELECT * FROM userUpvotedUsers WHERE upvoterid = ? AND upvoteeid = ?`, [giver_user, user], (err, row) => {
        if(err){
          console.log(err.message);
          reject({ code: 500, msg: err.message });
        }

        if(isEmpty(row)){
          db.run(`UPDATE users SET karma = karma + 1 WHERE username = ?`, user, function(err) {
            if(err){
              reject({code: 500, msg: err.message});
            } else {
              if(this.changes){
                db.run(`INSERT INTO userUpvotedUsers (upvoterid, upvoteeid) VALUES (?, ?)`, [giver_user, user], err => {
                  if(err){
                    reject({code: 500, msg: "Something went wrong inserting into userUpvotedUsers!"})
                  }
                  resolve({code: 200, msg: "OK"})
                })
              } else {
                resolve({code: 404, msg: "User not found"});
              }
            }
          });
        } else {
          db.run(`UPDATE users SET karma = karma - 1 WHERE username = ?`, user, function(err){
            if (err) {
              console.log(err.message);
              reject({ code: 500, msg: err.message });
            }
            if (this.changes) {
              db.run(
                `DELETE FROM userUpvotedUsers WHERE upvoterid = ? AND upvoteeid = ?`,
                [giver_user, user],
                function(err) {
                  if (err) {
                    console.log(err.message);
                    reject({ code: 500, msg: err.message });
                  }
                  resolve({ code: 200, msg: "OK" });
                }
              );
            } else {
              resolve({ code: 404, msg: "User not found" });
            }
          });
        }
      });
    });
  },

  checkKarma: function(user, giver_user) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM userUpvotedUsers WHERE upvoterid = ? AND upvoteeid = ?`;
      db.all(sql, [giver_user, user], (err, rows) => {
        if (err) {
          reject({ code: 500, msg: err.message });
        }
        resolve({
          code: 200,
          data: rows.length > 0,
          msg: "OK"
        });
      });
    });
  },

  //gives user moderator privileges
  promoteUser: function(username, rank) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE users SET rank = ? WHERE username = ?`;
      db.run(sql, [rank, username], function(err) {
        if (err) {
          reject({ code: 500, msg: err.message });
        }
        this.changes
          ? resolve({ code: 200, msg: "OK" })
          : resolve({ code: 404, msg: "User not found" });
      });
    });
  },

  // dangerous, rather than delete user and make the db unstable, probably just mark them as inactive.
  deleteUser: function(user) {
    return new Promise((resolve, reject) => {
      let sql = `DELETE FROM users WHERE username = ?`;
      db.run(sql, user, function(err) {
        if (err) {
          reject({ code: 500, msg: err.message });
        }

        if (this.changes) {
          resolve({ code: 200, msg: "OK" });
        } else {
          resolve({ code: 404, msg: "User not found" });
        }
      });
    });
  },

  updateUser: function(user, updates) {
    return new Promise((resolve, reject) => {
      //console.log("User is ",user);
      //console.log("Updates is ",updates);
      if (updates.last_login) {
        db.run(
          `UPDATE users SET last_login=? WHERE username=?`,
          [updates.last_login, updates.username],
          err => {
            if (err) {
              reject({ code: 500, msg: err.message });
            } else {
              resolve({ code: 200, msg: "OK" });
            }
          }
        );
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            reject({ code: 500, msg: err.message });
          }
          bcrypt.hash(updates.new_password, salt, (err, hash) => {
            if (err) {
              reject({ code: 500, msg: err.message });
            }
            let sql = `UPDATE users SET password=?, email = ?, zid=? WHERE username=?`;
            
            db.run(sql, [hash, updates.new_email, updates.new_zid, user], function(err){
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

  addFriend: function(username, friendname) {
    return new Promise((resolve, reject) => {
      if (this.userExists(username) && this.userExists(friendname)) {
        let sql = `INSERT INTO userFriends (userid, friendid) VALUES (?, ?), (?, ?)`;
        db.run(sql, [username, friendname, friendname, username], function(
          err
        ) {
          if (err) {
            reject({ code: 500, msg: err.message });
          }
          this.changes
            ? resolve({ code: 200, msg: "OK" })
            : resolve({
                code: 400,
                msg: "Failed to Insert, check your values again"
              });
        });
      } else {
        resolve({ code: 404, msg: "User not found" });
      }
    });
  },

  defriend: function(username, friendname) {
    return new Promise((resolve, reject) => {
      if (this.userExists(username) && this.userExists(friendname)) {
        let sql = `DELETE FROM userFriends WHERE userid = ? AND friendid = ?`;

        db.run(sql, [username, friendname], function(err) {
          if (err) {
            reject({ code: 500, msg: err.message });
          }
          this.changes
            ? resolve({ code: 200, msg: "OK" })
            : resolve({
                code: 400,
                msg: "Failed to Insert, check your values again"
              });
        });

        db.run(sql, [friendname, username], function(err) {
          if (err) {
            reject({ code: 500, msg: err.message });
          }
          this.changes
            ? resolve({ code: 200, msg: "OK" })
            : resolve({
                code: 400,
                msg: "Failed to Insert, check your values again"
              });
        });
      } else {
        resolve({ code: 404, msg: "User(s) not found" });
      }
    });
  },

  getFriendList: function(username) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT friendid FROM userFriends WHERE userid = ?`;
      db.all(sql, username, (err, rows) => {
        if (err) {
          reject({ code: 500, msg: err.message });
        }

        resolve({ code: 200, data: rows, msg: "OK" });
      });
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
              reject({ code: 500, msg: err.message });
            } else {
              let empty = !isEmpty(row);
              resolve({ code: empty ? 200 : 404, data: row });
            }
          }
        );
      } else {
        db.get(
          `SELECT * FROM users where username = ?`,
          identifier,
          (err, row) => {
            if (err) {
              reject({ code: 500, msg: err.message });
            } else {
              let empty = !isEmpty(row);
              resolve({ code: empty ? 200 : 404, data: row });
            }
          }
        );
      }
    });
  },

  //returns all the groups affiliated with the user
  userGroups: function(user) {
    return new Promise((resolve, reject) => {
      let sql = `select name from groupUsers 
      LEFT JOIN groups ON groupUsers.groupid = groups.id
      WHERE username = ?`;

      db.all(sql, user, (err, rows) => {
        if (err) {
          reject({ code: 500, msg: err.message });
        } else {
          resolve({ code: 200, data: rows });
        }
      });
    });
  },

  // returns all the courses enrolled by a user during the current term
  userCourses: function(user) {
    return new Promise((resolve, reject) => {
      this.userExists(user)
        .then(reply => {
          if (reply.code == 200) {
            let sql = `SELECT code FROM courseInstance
                  LEFT JOIN userCourses on
                  courseInstance.id = userCourses.courseInstance 
                  WHERE username = ? 
                  AND term = (SELECT term from term WHERE active);`;
            db.all(sql, user, (err, rows) => {
              if (err) {
                reject({ code: 500, msg: err.message });
              } else {
                resolve({ code: 200, data: rows });
              }
            });
          } else {
            resolve({ code: 404, msg: "Cant find user" });
          }
        })
        .catch(function(err) {
          if (err) {
            reject({ code: 500, msg: err.message });
          }
        });
    });
  },

  // minus password of course
  getUserInfo: function(users) {
    return new Promise((resolve, reject) => {
      if (!require("util").isArray(users)) {
        db.get(
          `SELECT email, zid, rank, date_joined, last_login, karma FROM users WHERE username = ?`,
          users,
          (err, row) => {
            if (err) {
              reject({ code: 500, msg: err.message });
            }
            let empty = !isEmpty(row);
            resolve({
              code: empty ? 200 : 404,
              data: row,
              msg: empty ? "OK" : "Username(s) not found"
            });
          }
        );
      } else {
        //if(userArray.length > 10){
        /*
          var i, j, temparray, chunk = 10;
          for (i=0,j=array.length; i<j; i+=chunk) {
              temparray = array.slice(i,i+chunk);
              // do whatever
          }*/
        //let sql = `SELECT email, zid, rank, date_joined, last_login, karma FROM users WHERE username IN ` + placeholders;
        //} else {

        let placeholders = users.map(user => "?").join(",");
        placeholders = "(" + placeholders + ")";
        let sql =
          `SELECT email, zid, rank, date_joined, last_login, karma FROM users WHERE username IN ` +
          placeholders;
        //console.log(sql);
        db.all(sql, users, (err, rows) => {
          if (err) {
            reject({ code: 500, msg: err.message });
          }
          //console.log(rows);
          let empty = !isEmpty(rows);
          resolve({
            code: empty ? 200 : 404,
            msg: empty ? "OK" : "Course not in db",
            data: rows
          });
        });
        //}
      }
    });
  }
};
