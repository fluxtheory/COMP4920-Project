const sqlite3 = require("sqlite3").verbose();
const isEmpty = require("is-empty");
const user = require("./usersDB");
const course = require("./courseDB");
const group = require("./groupDB");
const getdb = require("./db").getDb;

let db = getdb();
/*
let db = new sqlite3.Database("test.db", err => {
  if (err) {
    return console.error(err.message);
  }
  //console.log("Connected to sqlite3 database");
});
*/
/*
course_values = [
    ["COMP1000", "Introduction to World Wide Web, Spreadsheets and Databases"],
    ["COMP1400", "Programming for Designers"],
    ["COMP1511", "Programming Fundamentals"],
    ["COMP1521", "Computer Systems Fundamentals"],
    ["COMP1531", "Software Engineering Fundamentals"],
    ["COMP1911", "Computing 1A"],
    ["COMP1927", "Computing 2"],
    ["COMP2041", "Software Construction: Techniques and Tools"]
];

course_values.forEach(function(entry){
    //console.log(entry);
    db.run(`INSERT OR IGNORE INTO courses (code, name) VALUES (?, ?)`, entry);
});


courseInstance_values = [
    ["COMP1000", "2019T1"],
    ["COMP1000", "2019T2"],
    ["COMP1000", "2019T3"],
    ["COMP1400", "2019T1"],
    ["COMP1400", "2019T2"],
    ["COMP1400", "2019T3"],
    ["COMP1511", "2019T1"],
    ["COMP1511", "2019T2"],
    ["COMP1511", "2019T3"],
    ["COMP1521", "2019T1"],
    ["COMP1521", "2019T2"],
    ["COMP1521", "2019T3"],
    ["COMP1531", "2019T1"],
    ["COMP1531", "2019T2"],
    ["COMP1531", "2019T3"],
    ["COMP1911", "2019T1"],
    ["COMP1911", "2019T2"],
    ["COMP1911", "2019T3"],
    ["COMP1927", "2019T1"],
    ["COMP1927", "2019T2"],
    ["COMP1927", "2019T3"],
    ["COMP2041", "2019T1"],
    ["COMP2041", "2019T2"],
    ["COMP2041", "2019T3"]
];

courseInstance_values.forEach(function(entry){
    db.run(`INSERT OR IGNORE INTO courseInstance (code, term) VALUES (?, ?)`, entry, function(err){
        if(err){
            console.log(err);
        }
    });
});

userCourses_values = [
    ["aaaaa", 1],
    ["aaaaa", 2],
    ["aaaaa", 4],
    ["aaaaa", 16],
    ["asdas", 1],
    ["asdas", 7],
    ["johnwickfortnite", 3],
    ["johnwickfortnite", 6],
    ["johnwickfortnite", 9],
    ["johnwickfortnite", 12]
];

userCourses_values.forEach(function(entry){
    db.run(`INSERT OR IGNORE INTO userCourses (username, courseInstance) VALUES (?, ?)`, entry, function(err) {
        if(err){
            console.log(err);
        }
    });
});
*/
/*
user.courseUsers("COMP1000", "2019T1").catch(err => {
    if(err){
        console.log(err);
    }
}).then( function(rows) {
    console.log(rows);
});*/

/*
course.getCourses("COMP").then( rows => {
    console.log(rows);
});*/

/*
course.userCourses("johnwickfortnite").catch(err => {
    if(err){
        console.log(err);
    }
}).then( function(rows) {
    console.log(rows);
});*/

/*
user.deleteUser('aaaaa').catch(err => {
    console.log(err);
}).then( res => {
    console.log("Delete success is : " + res);
});*/


//console.log(new Date().getFullYear());
/*
groups = [
    ["aaaaa's Group", "COMP1400" , 'aaaaa'],
    ["aaaaa's Group", "COMP1911" , 'aaaaa'],
    ["john's Group", "COMP1400" , 'johnwickfortnite']

];

groupUsers = [
    [1, 'aaaaa'],
    [3, 'aaaaa'],
    [1, "johnwickfortnite"],
    [2, 'asdas']
];*/

/*
groups.forEach(function(entry){
        
    db.run(`INSERT INTO groups (name, courseInstance, owner) VALUES (?, ?, ?)`, entry, function(err) {
        if(err){
            console.log(err);
        }
        console.log(entry);
    })
    group.startGroup(entry[2], entry[0], entry[1]).catch(err => {
        if(err){
            console.log(err);
        }
    });
    
});*/
/*
group.getListofGroups("COMP1400").then(rows => {
    console.log(rows);
}).catch(err => {
    if(err){
        console.log(err);
    }
});*/

/*
group.getUserJ("COMP1400").then(rows => {
    console.log(rows);
}).catch(err => {
    if(err){
        console.log(err);
    }
});*/

/*
groupUsers.forEach(function(entry){
    
    db.run(`INSERT INTO groupUsers (groupid, username) VALUES (?, ?)`, entry, function(err) {
        if(err){
            console.log(err);
        }
        console.log(entry);
    })
    
});
*/

//const courses = require("./text/courses");
//console.log(courses);

/*
let sql = `DELETE FROM users WHERE username = ?`;
db.run(sql, "fluxtheory", function(err){
    console.log("Deleting " + this.lastID);
    console.log("Rows deleted: " + this.changes);
    if (err) {
      console.log(err.message);
    }
    if( `${this.changes}` > 0){
      db.run(`DELETE FROM userCourses WHERE username = ?`, "fluxtheory");
    }
});
*/
/*
let query = `INSERT INTO users (username, password, email) VALUES(?, ?, ?)`;
      db.run(query, ["fluxtheory", "fjalfk", "@hotmail.com"], function(err) {
        console.log("Inserted into id: " + this.lastID);
        console.log("Rows inserted: "+ this.changes);
      });
*/
   /*    
let query = `UPDATE users SET email = ? WHERE username = ?`;
db.run(query, ["the_frost_wyrm@hotmail.com", "fluxtheory"], function(err) {
  console.log("Updated id: " + this.lastID);
  console.log("Rows updated: "+ this.changes);
});
 */

/*
function test(){
    return new Promise((resolve, reject) => {
        reject(1, true, "hey");
    });
}

test().then( (a,b,c) => {
    //console.log(a,b,c);
}).catch((err, a, b) => {
    console.log(err,a,b);
})*/

let test = [];
console.log(isEmpty(test));
