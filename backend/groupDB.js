const getdb = require("./db").getDb;

let db = getdb();

module.exports = {
  startGroup: function(user, group_name, course) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO groups (name, courseInstance, owner) 
                VALUES (?, (SELECT id FROM courseInstance where 
                term = (SELECT term from term where active) AND code = ?), ?)`, [group_name, course, user], err => {
                if(err){
                    console.log(err.message);
                    reject(err.message);
                }
                this.addUsertoGroup(user, group_name, course)
                .then(reply => {
                    if(reply){
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .catch(err => {
                    if(err){
                        console.log(err.message);
                        reject(err.message);
                    }
                });
            });
        });
    },

    getListofGroups: function(course) {
        return new Promise((resolve, reject) => {
            db.all(`SELECT name FROM groups LEFT JOIN courseInstance 
            ON groups.courseInstance = courseInstance.id
            WHERE courseInstance.term = (SELECT term from term WHERE active)
            AND courseInstance.code = ?`, course, (err, rows) => {
                if(err){
                    reject(err.message);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    // returns a list of Groups that the user is part of with respect to a particular course.
    getUserJoinedGroups: function(user, course){
        return new Promise((resolve, reject) => {
            db.all(`SELECT name FROM groupUsers 
            LEFT JOIN groups on groupid = groups.id
            LEFT JOIN courseInstance on groups.courseInstance = courseInstance.id
            WHERE username = ? AND code = ?`, [user, course], (err, rows) => {
                if(err){
                    reject(err.message);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    // deletes a group from the group table and user listings in groupUsers
    deleteGroup : function(group_name, course){
        return new Promise((resolve, reject) => {        

            db.run(`DELETE FROM groups WHERE id IN (
                SELECT groups.id FROM groups 
                LEFT JOIN courseInstance
                ON groups.courseInstance = courseInstance.id
                WHERE term = (SELECT term from term WHERE active)
                AND code = ?
                AND name = ?)`, [course, group_name], function(err) {
                    if(err){
                        console.log(err.message);
                        reject(err.message);
                    } else {
                        if(this.changes){
                            resolve(true);
                        } else {
                            resolve(false);
                        }
                    }
            });
        });
    },

    addUsertoGroup : function(username, group_name, course){
        return new Promise((resolve, reject) => {
            let sql = `INSERT INTO groupUsers (groupid, username) VALUES 
                ( 
                    (SELECT groups.id FROM groups 
                    LEFT JOIN courseInstance on groups.courseInstance = courseInstance.id
                    WHERE name = ?
                    and term = (SELECT term from term where active)
                    and code = ?), ?
                )`;
            db.run(sql, [group_name, course, username], function(err) {
                if(err){
                    //console.log("Failed to add ", username);
                    console.log(err.message);
                    reject(err.message);
                } else {
                    if(this.lastID){
                        //console.log("Added ", username);
                        resolve(true);
                    } else {
                        resolve(false);
                    } 
                }
            });
        });
    },

    transferGroupOwnership: function(new_leader, group_name, course){
        return new Promise((resolve, reject) => {
            let sql = `UPDATE groups SET owner = ?
                    WHERE name = ?
                    AND courseInstance = 
                        (SELECT id FROM courseInstance 
                        WHERE code = ?
                        AND term = 
                            (SELECT term from term where active)
                        )`
            db.run(sql, [new_leader, group_name, course], function(err) {
                if(err){
                    reject(err.message);
                } else {
                    if(this.changes){
                        resolve(true);
                    } else {
                        resolve(false);
                    }                    
                }
            });
        })
    },

    leaveGroup: function(user, group_name, course){

        // check if user is owner
        // if not, remove him as usual.
        // if owner leaves, ownership falls to second to join member. 
        // If no members are remaining the group is disbanded.
        
        /*
            if(member.count > 1){
                if(user to be removed == group.owner){
                    //reject
                } else {
                    removeUser()
                }
            } else {
                // disband group.
            }
        */

        return new Promise((resolve, reject) => {
            
            
        });
    },


    removeUserfromGroup : function(user, group_name, course){
        return new Promise((resolve, reject) => {
            let sql = `DELETE FROM groupUsers WHERE id IN (
                select groupUsers.id from groupUsers
                LEFT JOIN groups ON groupUsers.groupid = groups.id
                LEFT JOIN courseInstance ON groups.courseInstance = courseInstance.id
                WHERE term = (SELECT term from term where active)
                AND username = ?
                AND name = ?
                AND code = ?)`; 
            db.run(sql, [user, group_name, course], function(err) {
                if(err){
                    reject(err.message);
                } else {
                    if(this.changes){
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                }
            });    
        });
    },

  // returns all the users in a group
  getGroupUsers: function(group_name, course) {
    return new Promise((resolve, reject) => {
      db.all(
        `select username from groupUsers
            LEFT JOIN groups on groupUsers.groupid = groups.id
            LEFT JOIN courseInstance on groups.courseInstance = courseInstance.id
            WHERE term = (SELECT term from term WHERE active)
            AND code = ?
            AND name = ?`, [course, group_name], (err, rows) => {
                if(err){
                    reject(err.message)
                } else {
                    resolve(rows);
                }
            });
        });
    }
}
