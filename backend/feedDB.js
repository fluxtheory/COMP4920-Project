const getdb = require("./db").getDb;

let db = getdb();

module.exports = {

    // add/reply comment
    addPost: function(parentId, user, course, content){
      return new Promise((resolve, reject) => {
        db.run(`INSERT INTO forumPosts 
        (courseInstanceId, parentId, userId, datetime, postContent) 
        VALUES ( (SELECT courseInstance.id FROM courseInstance 
                  WHERE term = (SELECT term from term where active) 
                  AND code = ?),
        ?, ?, ?, ?)`, [course, parentId, user, new Date(), content], err => {
          if(err){
            reject(err.message);
          } else {
            resolve(true);
          }
        });
      });
    },

    // delete post
    deletePost: function(id){
      return new Promise((resolve, reject) => {
        db.run(`DELETE FROM forumPosts where id = ?`, id, err => {
          if(err){
            reject(err.message);
          } else {
            resolve(true);
          }
        });
      });
    },

    editPost: function(id, content){
      return new Promise((resolve, reject) => {
        resolve(true);
      });
    },
    // upboat
    upvotePost: function(id){
      return new Promise((resolve, reject) => {
        db.run(`UPDATE forumPosts SET kudoes = kudoes + 1 WHERE id = ?`, id, err =>{
          if(err){
            reject(err.message);
          } else {
            resolve(true);
          }
        });
      });
    },

    // get course posts
    getCourseFeed: function(course){
      return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM forumPosts 
        WHERE courseInstanceId = 
            (SELECT id FROM courseInstance 
            WHERE term = (SELECT term FROM term WHERE active)
            AND code = ?)
        )`, course, (err, rows) => {
          if(err){
            reject(err.message);
          } else {
            sorted = this.sortCourseFeed(rows);
            resolve(sorted);
          }
        });
      });
    },

    sortCourseFeed: function(posts){
      return posts;
    }

}