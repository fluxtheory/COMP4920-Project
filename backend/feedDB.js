const getdb = require("./db").getDb;

let db = getdb();

module.exports = {

    // add/reply comment
    addPost: function(user, course, content, parentId){
      return new Promise((resolve, reject) => {
        let sql = `INSERT INTO forumPosts 
        (courseInstanceId, parentId, userId, datetime, postContent) 
        VALUES ( (SELECT courseInstance.id FROM courseInstance 
                  WHERE term = (SELECT term from term where active) 
                  AND code = ?),
        ?, ?, ?, ?)`;
        db.run(sql, [course, parentId, user, new Date(), content], function(err) {
          if(err){
            reject({code: 500, msg: err.message});
          }
          
          (this.changes)
          ? resolve({code: 200, msg: "OK"})
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
    upvotePost: function(postid){
      return new Promise((resolve, reject) => {
        let sql = `UPDATE forumPosts SET kudoes = kudoes + 1 WHERE id = ?`;
        db.run(sql, postid, function(err) {
          if(err){
            reject({code: 500, msg: err.message});
          } 
          (this.changes) 
          ? resolve({code: 200, msg: "OK"}) 
          : resolve({code: 404, msg: "Post not found"});
        });
      });
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

    toggleStickyPost: function(postid){
      return new Promise((resolve, reject) => {
        let sql = `UPDATE forumPosts SET sticky = NOT sticky WHERE id = ?`;
        db.run(sql, postid, function(err) {
          if(err){
            reject({code: 500, msg: err.message});
          }
          (this.changes) 
          ? resolve({code: 200, msg: "OK"}) 
          : resolve({code: 404, msg: "Post not found"});
        });
      })
    }
}