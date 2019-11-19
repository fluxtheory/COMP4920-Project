const getdb = require("./db").getDb;
const isEmpty = require("is-empty");
let db = getdb();

module.exports = {
  // add/reply comment
  addPost: function(user, course, content, rootId, branchId, title) {
    return new Promise((resolve, reject) => {
      let sql = `INSERT INTO forumPosts 
      (courseInstanceId, rootId, branchId, userId, datetime, postContent, title) 
      VALUES ( (SELECT courseInstance.id FROM courseInstance 
                WHERE term = (SELECT term from term where active) 
                AND code = ?),
      ?, ?, ?, ?, ?, ?)`;
      db.run(
        sql,
        [course, rootId, branchId, user, new Date(), content, title],
        function(err) {
          if (err) {
            console.log(err);
            reject({ code: 500, msg: err.message });
          }

          this.changes
            ? resolve({ code: 200, msg: "OK" })
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
      db.get(
        `SELECT * FROM userUpvotedPosts WHERE postid = ? and userid = ?`,
        [postid, user],
        (err, row) => {
          if (err) {
            console.log(err.message);
            reject({ code: 500, msg: err.message });
          }

          if (isEmpty(row)) {
            let sql = `UPDATE forumPosts SET kudos = kudos + 1 WHERE id = ?`;
            db.run(sql, postid, function(err) {
              if (err) {
                console.log(err.message);
                reject({ code: 500, msg: err.message });
              }
              if (this.changes) {
                db.run(
                  `INSERT INTO userUpvotedPosts (userid, postid) VALUES (?, ?)`,
                  [user, postid],
                  function(err) {
                    if (err) {
                      console.log(err.message);
                      reject({ code: 500, msg: err.message });
                    }
                    resolve({ code: 200, msg: "OK" });
                  }
                );
              } else {
                resolve({ code: 404, msg: "Post not found" });
              }
            });
          } else {
            let sql = `UPDATE forumPosts SET kudos = kudos - 1 WHERE id = ?`;
            db.run(sql, postid, function(err) {
              if (err) {
                console.log(err.message);
                reject({ code: 500, msg: err.message });
              }
              if (this.changes) {
                db.run(
                  `DELETE FROM userUpvotedPosts WHERE userid = ? AND postid = ?`,
                  [user, postid],
                  function(err) {
                    if (err) {
                      console.log(err.message);
                      reject({ code: 500, msg: err.message });
                    }
                    resolve({ code: 200, msg: "OK" });
                  }
                );
              } else {
                resolve({ code: 404, msg: "Post not found" });
              }
            });
          }
        }
      );
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
          WHERE courseInstanceId = 
              (SELECT id FROM courseInstance 
              WHERE term = (SELECT term FROM term WHERE active)
              AND (rootId = ? OR id = ?))`,
        [postId, postId],
        (err, rows) => {
          if (err) {
            reject({ code: 500, msg: err.message });
          } else {
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

  toggleStickyPost: function(postid) {
    return new Promise((resolve, reject) => {
      let sql = `UPDATE forumPosts SET sticky = NOT sticky WHERE id = ?`;
      db.run(sql, postid, function(err) {
        if (err) {
          reject({ code: 500, msg: err.message });
        }
        this.changes
          ? resolve({ code: 200, msg: "OK" })
          : resolve({ code: 404, msg: "Post not found" });
      });
    });
  }
};