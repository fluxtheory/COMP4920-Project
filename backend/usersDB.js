const sqlite3 = require("sqlite3").verbose();
const isEmpty = require("is-empty");

let db = new sqlite3.Database("test.db", err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to sqlite3 database");
});

module.exports = {
  addUser: function addUser(user) {
    return new Promise((resolve, reject) => {
      let username = user.username;
      let email = user.email;
      let password = user.password;
      let date_joined = Date.now().toString();
      let errors = {};

      let query = `INSERT INTO users (username, password, email, zid, rank, date_joined) VALUES(?, ?, ?, ?, ?, ?)`;
      db.run(query, [username, password, email, null, 3, date_joined], function(
        err
      ) {
        if (err) {
          //console.log(err.message);
          reject(err.message);
        } else {
          resolve(true);
        }
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
  }
};
