const getdb = require("./db").getDb;
const isEmpty = require("is-empty");
let db = getdb();

module.exports = {

    // add/reply comment
    addPost: function(user, course, content, parentId){
      return new Promise((resolve, reject) => {
        let sql = `INSERT INTO forumPosts 
        (courseInstance, parentId, userId, datetime, postContent) 
        VALUES ( (SELECT courseInstance.id FROM courseInstance 
                  WHERE term = (SELECT term from term where active) 
                  AND code = ?),
        ?, ?, ?, ?)`;
        db.run(sql, [course, parentId, user, new Date().toString(), content], function(err) {
          if(err){
            console.log(err.message);
            reject({code: 500, msg: err.message});
          }
          
          (this.changes)
          ? resolve({code: 200, msg: "OK", postId: this.lastID})
          : resolve({code: 400, msg: "Cannot add post, please recheck fields"})          

        });
      });
    },

    // delete post
    deletePost: function(postid){
      return new Promise((resolve, reject) => {
        let sql = `DELETE FROM forumPosts where id = ?`;
        db.run(sql, postid, function(err) {
          if(err){
            reject({code: 500, msg: err.message});
          } 
          
          (this.changes)
          ? resolve({code: 200, msg: "OK"})
          : resolve({code: 404, msg: "Post not found"})          
        });
      });
    },

    editPost: function(postid, content){
      return new Promise((resolve, reject) => {
        let sql = `UPDATE forumPosts SET postContent = ? WHERE id = ?`;
        db.run(sql, [content, postid], function(err) {
          if(err){
            reject({code: 500, msg: err.message});
          }    
          (this.changes) 
          ? resolve({code: 200, msg: "OK"}) 
          : resolve({code: 404, msg: "Post not found"});
        });
      });
    },
    // upboat
    upvotePost: function(postid, user){
      return new Promise((resolve, reject) => {
        
        db.get(`SELECT * FROM userUpvotedPosts WHERE postid = ? and userid = ?`, [postid, user], (err, row) => {
          if(err){
            console.log(err.message);
            reject({code: 500, msg: err.message});
          }

          if(isEmpty(row)){
            let sql = `UPDATE forumPosts SET kudos = kudos + 1 WHERE id = ?`;
            db.run(sql, postid, function(err) {
              if(err){
                console.log(err.message);
                reject({code: 500, msg: err.message});
              } 
              if(this.changes) {
                db.run(`INSERT INTO userUpvotedPosts (userid, postid) VALUES (?, ?)`, [user, postid], function(err) {
                  if(err){
                    console.log(err.message);
                    reject({code: 500, msg: err.message});
                  }
                  resolve({code: 200, msg: "OK"}) 
                });
              } else {
                resolve({code: 404, msg: "Post not found"});
              }
              
            });
          } else {
            let sql = `UPDATE forumPosts SET kudos = kudos - 1 WHERE id = ?`;
            db.run(sql, postid, function(err) {
              if(err){
                console.log(err.message);
                reject({code: 500, msg: err.message});
              } 
              if(this.changes) {
                db.run(`DELETE FROM userUpvotedPosts WHERE userid = ? AND postid = ?`, [user, postid], function(err) {
                  if(err){
                    console.log(err.message);
                    reject({code: 500, msg: err.message});
                  }
                  resolve({code: 200, msg: "OK"}) 
                });
                
              } else {
                resolve({code: 404, msg: "Post not found"});
              }   
            });
          }
        })
      });
    },

    getPost: function(postid){
      return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM forumPosts where id = ?`;
        db.get(sql, postid, function(err, row) {
          if(err){
            reject({code:500, msg: err.message});
          }

          let empty = isEmpty(row);
          resolve( {code: (empty) ? 404 : 200, data: row });

        });
      })
    },

    // get course posts
    getCourseFeed: function(course){
      return new Promise((resolve, reject) => {
        let sql = `SELECT * FROM forumPosts 
            WHERE courseInstanceId = 
            (SELECT id FROM courseInstance 
            WHERE term = (SELECT term FROM term WHERE active)
            AND code = ?)
        )`;
        db.all(sql, course, (err, rows) => {
          if(err){
            reject({code: 500, msg: err.message});
          } else {
            sorted = this.sortCourseFeed(rows);
            resolve(sorted);
          }
        });
      });
    },

    sortCourseFeed: function(posts){
      var List = require('linked-list');

      //posts.forEach();
      return posts;
    },

    toggleStickyPost: function(postid, user){
      return new Promise((resolve, reject) => {

        db.get(`SELECT rank from USERS WHERE username = ?`, user, (err, row) => {
          if(err || !row){
            reject({code: 500, msg: err.message});
          }
          if(row.rank == 1){ 
            let sql = `UPDATE forumPosts SET sticky = NOT sticky WHERE id = ?`;
            db.run(sql, postid, function(err) {
              if(err){
                reject({code: 500, msg: err.message});
              }
              (this.changes) 
              ? resolve({code: 200, msg: "OK"}) 
              : resolve({code: 404, msg: "Post not found"});
            });
          } else {
            reject({code: 403, msg: "Not authorized, rank too low"});
          }
      })
    })
  }
}