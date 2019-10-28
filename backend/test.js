const sqlite3 = require("sqlite3").verbose();
const isEmpty = require("is-empty");
const user = require("./usersDB")

let db = new sqlite3.Database("test.db", err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Connected to sqlite3 database");
});


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
    db.run(`INSERT OR IGNORE INTO courses (name, code) VALUES (?, ?)`, entry);
});


courseInstance_values = [
    ["COMP1000", "19T1"],
    ["COMP1000", "19T2"],
    ["COMP1000", "19T3"],
    ["COMP1400", "19T1"],
    ["COMP1400", "19T2"],
    ["COMP1400", "19T3"],
    ["COMP1511", "19T1"],
    ["COMP1511", "19T2"],
    ["COMP1511", "19T3"],
    ["COMP1521", "19T1"],
    ["COMP1521", "19T2"],
    ["COMP1521", "19T3"],
    ["COMP1531", "19T1"],
    ["COMP1531", "19T2"],
    ["COMP1531", "19T3"],
    ["COMP1911", "19T1"],
    ["COMP1911", "19T2"],
    ["COMP1911", "19T3"],
    ["COMP1927", "19T1"],
    ["COMP1927", "19T2"],
    ["COMP1927", "19T3"],
    ["COMP2041", "19T1"],
    ["COMP2041", "19T2"],
    ["COMP2041", "19T3"]
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
    ["johnwickfortnite", 13]
];

userCourses_values.forEach(function(entry){
    db.run(`INSERT OR IGNORE INTO userCourses (username, courseInstance) VALUES (?, ?)`, entry, function(err) {
        if(err){
            console.log(err);
        }
    });
});

/*
user.courseUsers("COMP1000", "19T1").catch(err => {
    if(err){
        console.log(err);
    }
}).then( function(rows) {
    console.log(rows);
});*/


user.userCourses("aaaaa", "19T2").then( rows => {
    console.log(rows);
});




db.close();
