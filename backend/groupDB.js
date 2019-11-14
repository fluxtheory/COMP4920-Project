const getdb = require("./db").getDb;

let db = getdb();

module.exports = {
    startGroup: function(user, group_name, course){
        
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO groups (name, courseInstance, owner) 
                VALUES (?, (SELECT id FROM courseInstance where 
                term = (SELECT term from term where active) AND code = ?), ?)`, [group_name, course, user], err => {
                if(err){
                    reject(err);
                }
                this.addUsertoGroup(user, group_name, course);
                resolve(true); 
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
                    reject(err)
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
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    // deletes a group from the group table and user listings in groupUsers
    deleteGroup : function(group_name, course){
        return new Promise((resolve, reject) => {
            // delete from groupUsers as well.        

            db.run(`DELETE FROM groupUsers WHERE id IN (
                SELECT groupUsers.id FROM groupUsers 
                LEFT JOIN groups on groupUsers.groupid = groups.id
                LEFT JOIN courseInstance on groups.courseInstance = courseInstance.id
                WHERE term = (SELECT term FROM term WHERE active)
                AND name = ?
                AND code = ?)`, [group_name, course], err => {
                if(err){
                    console.log(err);
                    reject(err);
                }
                
                db.run(`DELETE FROM groups WHERE id IN (
                    SELECT groups.id FROM groups 
                    LEFT JOIN courseInstance
                    ON groups.courseInstance = courseInstance.id
                    WHERE term = (SELECT term from term WHERE active)
                    AND code = ?
                    AND name = ?)`, [course, group_name], err => {
                        if(err){
                            console.log(err);
                            reject(err)
                        } else {
                            resolve(true);
                        }
                });
            });

        });
    },

    addUsertoGroup : function(username, group_name, course){
        return new Promise((resolve, reject) => {
            db.run(`INSERT INTO groupUsers (groupid, username) VALUES 
            ( 
                (SELECT groups.id FROM groups 
                LEFT JOIN courseInstance on groups.courseInstance = courseInstance.id
                WHERE name = ?
                and term = (SELECT term from term where active)
                and code = ?), ?
            )`,[group_name, course, username], err => {
                if(err){
                    reject(err)
                } else {
                    resolve(true);
                }
            });
        });
    },

    transferGroupLeader: function(new_leader, group_name, course){
        return new Promise((resolve, reject) => {
            db.run(`UPDATE groups SET owner = ? WHERE id = ?`, [row.username, row.groupid], err => {
                if(err){
                    reject(err.message);
                } else {
                    resolve(true);
                }
            });
        })
    },

    leaveGroup: function(user, group_name, course){
        
        // if owner leaves, ownership falls to second to join member. If no members are remaining the group is destroyed.
        //check if user is owner
        // if not, remove him as usual.

        return new Promise((resolve, reject) => {
            db.get(`select owner from groups
            LEFT JOIN courseInstance on groups.courseInstance = courseInstance.id
            WHERE term = (SELECT term FROM term WHERE active)
            and code = ?
            and name = ?`, [course, group_name], (err, rows) => {
                if(err){
                    reject(err.message);
                }

                if(rows.owner === user){
                    // check if the group has more members afterwards, 
                    //if 0. Delete the group as well.
                    // else
                    //delete owner
                    //promote second earliest to join user to owner.
                    
                    db.get(`select count(username) as COUNT from groupUsers
                    LEFT JOIN groups ON groupUsers.groupid = groups.id
                    LEFT JOIN courseInstance ON groups.courseInstance = courseInstance.id
                    WHERE term = (SELECT term from term where active)
                    AND name = ?`, user, (err, rows) => {
                        if(err){
                            reject(err.message);
                        }
//UPDATE forumPosts SET kudoes = kudoes + 1 WHERE id = ?`, id, err =>{
                        if(rows.COUNT > 1){
                            //delete user from group then promote next user to owner
                            this.removeUserfromGroup(user, group_name, course).catch();

                            // find the next user in the group.
                            db.get(`select groupid, username from groupUsers
                            LEFT JOIN groups ON groupUsers.groupid = groups.id
                            LEFT JOIN courseInstance ON groups.courseInstance = courseInstance.id
                            WHERE term = (SELECT term from term where active)
                            AND name = ?`, [], (err, row) => {
                                if(err){
                                    reject(err.message);
                                }

                                // user promotion.
                                this.transferGroupLeader()                   
                            });
                            
                        } else {
                            //delete user from group then delete group.
                            this.removeUserfromGroup(user, group_name, course).catch( err => {
                                if(err){
                                    reject(err.message);
                                } else {
                                    resolve(true);
                                }
                            });
                            this.deleteGroup(group_name, course).catch(err => {
                                if(err){
                                    reject(err.message);
                                } else {
                                    resolve(true);
                                }
                            });
                        }
                    });
                } else {
                    this.removeUserfromGroup(user, group_name, course).catch(err => {
                        if(err){
                            reject(err.message);
                        } else {
                            resolve(true);
                        }
                    });
                }
            });
        });
    },

    removeUserfromGroup : function(user, group_name, course){
        db.run(`DELETE FROM groupUsers WHERE id IN (
            select groupUsers.id from groupUsers
            LEFT JOIN groups ON groupUsers.groupid = groups.id
            LEFT JOIN courseInstance ON groups.courseInstance = courseInstance.id
            WHERE term = (SELECT term from term where active)
            AND username = ?
            AND name = ?
            AND code = ?
        )`, [user, group_name, course], err => {
            if(err){
                throw err;
            }
        });
    },

    // returns all the users in a group
    getGroupUsers : function(group_name, course){
        return new Promise((resolve, reject) => {
            db.all(`select username from groupUsers
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