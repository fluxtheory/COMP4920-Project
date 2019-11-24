const getdb = require("./db").getDb;
const isEmpty = require("is-empty");
let db = getdb();

module.exports = {
  // add/reply comment
  addPost: function(user, course, content, rootId, branchId, title, sticky) {
    return new Promise((resolve, reject) => {
      let sql = `INSERT INTO forumPosts 
      (courseInstanceId, rootId, branchId, userId, datetime, postContent, title, sticky) 
      VALUES ( (SELECT courseInstance.id FROM courseInstance 
                WHERE term = (SELECT term from term where active) 
                AND code = ?),
      ?, ?, ?, ?, ?, ?, ?)`;
      db.run(
        sql,
        [course, rootId, branchId, user, new Date(), content, title, sticky],
        function(err) {
          if (err) {
            console.log(err);
            reject({ code: 500, msg: err.message });
          }

          this.changes
            ? resolve({ code: 200, msg: "OK", postId: this.lastID })
            : resolve({
                code: 400,
                msg: "Cannot add post, please recheck fields"
              });
        }
      );
    });
  },

  // delete post
  deletePost: function(postid) {
    return new Promise((resolve, reject) => {
      let sql = `DELETE FROM forumPosts where id = ?`;
      db.run(sql, postid, function(err) {
        if (err) {
          reject({ code: 500, msg: err.message });
        }

        this.changes
          ? resolve({ code: 200, msg: "OK" })
          : resolve({ code: 404, msg: "Post not found" });
      });
    });
  },

  editPost: function(postid, content) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE forumPosts SET postContent = ? WHERE id = ?`;
      db.run(sql, [content, postid], function(err) {
        if (err) {
          reject({ code: 500, msg: err.message });
        }
        this.changes
          ? resolve({ code: 200, msg: "OK" })
          : resolve({ code: 404, msg: "Post not found" });
      });
    });
  },
  // upboat
  upvotePost: function(postid, user) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT OR IGNORE INTO userUpvotedPosts (userid, postid) VALUES (?, ?)`,
        [user, postid],
        function(err) {
          if (err) {
            console.log(err.message);
            reject({ code: 500, msg: err.message });
          }
          resolve({ code: 200, msg: "OK" });
        }
      );
    });
  },

  upvoteStatus: function(postId, username) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM userUpvotedPosts WHERE 
      postid=? AND userid=?`;
      db.get(sql, [postId, username], function(err, row) {
        if (err) {
          console.log(err);
          reject({ code: 500, msg: err.message });
        }
        let empty = isEmpty(row);
        resolve({ code: 200, data: !empty });
      });
    });
  },

  getPost: function(postid) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM forumPosts where id = ?`;
      db.get(sql, postid, function(err, row) {
        if (err) {
          reject({ code: 500, msg: err.message });
        }

        let empty = isEmpty(row);
        resolve({ code: empty ? 404 : 200, data: row });
      });
    });
  },

  // get course posts
  getCourseFeed: function(course) {
    return new Promise((resolve, reject) => {
      let sql = `SELECT * FROM forumPosts 
            WHERE courseInstanceId = 
            (SELECT id FROM courseInstance 
            WHERE term = (SELECT term FROM term WHERE active) 
            AND code = ?)
        `;
      db.all(sql, course, (err, rows) => {
        if (err) {
          reject({ code: 500, msg: err.message });
        } else {
          sorted = this.sortCourseFeed(rows);
          resolve(sorted);
        }
      });
    });
  },

  // get post and all that have it as a root
  getPostAndChildren: function(postId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM forumPosts 
          WHERE rootId = ? OR id = ?`,
        [postId, postId],
        (err, rows) => {
          if (err) {
            reject({ code: 500, msg: err.message });
          } else {
            sorted = this.sortCourseFeed(rows);
            resolve(sorted);
          }
        }
      );
    });
  },

  sortCourseFeed: function(posts) {
    var List = require("linked-list");

    //posts.forEach();
    return posts;
  },

  toggleStickyPost: function(postid, user) {
    //console.log(user);
    return new Promise((resolve, reject) => {
      db.get(`SELECT rank FROM users WHERE username = ?`, user, (err, row) => {
        if (err) {
          reject({ code: 500, msg: err.message });
        }

        if (!row) {
          resolve({ code: 404, msg: "User not found" });
        }

        if (row.rank == 1) {
          let sql = `UPDATE forumPosts SET sticky = NOT sticky WHERE id = ?`;
          db.run(sql, postid, function(err) {
            if (err) {
              reject({ code: 500, msg: err.message });
            }
            this.changes
              ? resolve({ code: 200, msg: "OK" })
              : resolve({ code: 404, msg: "Post not found" });
          });
        } else {
          reject({ code: 403, msg: "Not authorized, rank too low" });
        }
      });
    });
  }
};
