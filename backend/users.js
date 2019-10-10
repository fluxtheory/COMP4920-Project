const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('test.db', (err) => {
    if(err){
      return console.error(err.message);
    }
    console.log('Connected to sqlite3 database');
});

module.exports = {
    
    addUser :
    function addUser(username, email, password){
        //check if user exists
        if(!userExists(username)){
            console.log(username + "is not in the database");

            /*
            db.exec(schema_query, function(err){
                if(err){
                    console.log(err.message);
                }
            });*/
        }
    
        
    
        
    
        // add user if it doesnt
    },

    userExists :
    function userExists(username, callback){
        let query = `SELECT * FROM users where username = ?`;
        var exists = null;

        db.get(query, [username], (err, row) => {  
            if(err){
                console.log(err.message);
            } else {
                console.log("test1");
                exists = true;
            }
        });
        console.log("test2");   // async, exists gets returned before the query is complete.
        return exists;
        /*return new Promise((resolve,reject) => {
            let query = `SELECT * FROM users where username = ?`;
            var exists = null;

            db.get(query, [username], (err, row) => {  
                if(err){
                    console.log(err.message);
                } else {
                    exists = true;
                }
            });
        
        }, (err, n) => {
            if(err){
                reject(err);
            } else {
                console.log(exists);
                resolve(exists);
            }
        });*/


    }
        
}
