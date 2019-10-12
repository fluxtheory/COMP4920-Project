const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('test.db', (err) => {
    if(err){
      return console.error(err.message);
    }
    console.log('Connected to sqlite3 database');
});

module.exports = {
    
    addUser :
    async function addUser(username, email, password){
        //check if user exists

        //let ans = await db.get("SELECT * FROM users where username = 'xavier'");
        //console.log(ans.email);
        let ans = await userExists(username);
        if(typeof(ans) == "undefined"){
            console.log(username + " not found");
        } else {
            console.log(username + " found!");
        }
        
        // add user if it doesnt
    },

    userExists :    
    function userExists(username){
        return new Promise((resolve, reject) => {
            db.get(`SELECT * FROM users where username = ?`, username, (err, row) => {  
                if(err){
                    console.log(err.message);
                    reject(err);
                } else {
                    resolve(row);
                }
                
            });
        });
    }
}



