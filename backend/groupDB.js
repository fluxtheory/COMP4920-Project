const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("test.db", err => {
    if (err) {
      return console.error(err.message);
    }
    //console.log("Connected to sqlite3 database");
});

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

    removeUserfromGroup : function(user, group_name){
        return new Promise((resolve, reject) => {

            // if owner leaves, ownership falls to second to join member. If no members are remaining the group is destroyed.
            db.run();
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
                    reject(err)
                } else {
                    resolve(rows);
                }
            });
        });
    }
}