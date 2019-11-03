const sqlite3 = require("sqlite3").verbose();

let _db;

// refactoring so we only have a single database access script.

module.exports = {
    getDb,
    initDb
};

function initDb(callback){
    if(_db){
        console.warn("Attempting to init DB again!");
        return callback(null, _db);
    }
}

function connect(err, db){

}