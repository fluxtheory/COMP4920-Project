process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
//var crypto = require("crypto");


chai.use(chaiHttp);

describe('/POST register', () => {
    it('should register a user', (done) => {
        
        let newUser = {
            name: "testacc", 
            email: "testacc@unsw.edu.au", 
            password: "bbbbb1", 
            password2: "bbbbb1"
        };

    chai.request("http://localhost:3001")
        .post('/register')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(newUser)
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a('object');
                //res.body.length.should.be.eql(1);
            done();
        });
    });

    it('should register a user with an already existing username', (done) => {
        
        let newUser = {
            name: "fluxtheory", 
            email: "z5061016@unsw.edu.au", 
            password: "bbbbb1", 
            password2: "bbbbb1"
        };

    chai.request("http://localhost:3001")
        .post('/register')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(newUser)
        .end((err, res) => {
            res.should.have.status(400);
            res.body.should.be.a('object');
                //res.body.length.should.be.eql(1);
            done();
        });
    });
});


describe('/POST login group', () => {
    it('should login to a user', (done) => {

    chai.request("http://localhost:3001")
        .post('/login')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({nameOrEmail : "bbbbb", password: "bbbbb1"})
        .end((err, res) => {
            res.should.have.status(200);
                //res.body.should.be.a('object');
                //res.body.length.should.be.eql(1);
            done();
        });
    });

    it('should fail login', (done) => {

    chai.request("http://localhost:3001")
        .post('/login')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({nameOrEmail : "bbbbb", password: "hello"})
        .end((err, res) => {
            res.should.have.status(403);
                //res.body.should.be.a('object');
                //res.body.length.should.be.eql(1);
            done();
        });
    });

    it('should fail login', (done) => {
        chai.request("http://localhost:3001")
            .post('/login')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({nameOrEmail : "cheerio", password: "hello"})
            .end((err, res) => {
                res.should.have.status(404);
                    //res.body.should.be.a('object');
                    //res.body.length.should.be.eql(1);
                done();
            });
    })
});


describe('/POST User Promotion', () => {
    it("should promote testacc to level 1", (done) => {
        chai.request("http://localhost:3001")
        .post( ('/user/promote'))
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({username : "testacc"})
        .end((err, res) => {
            res.should.have.status(200);
                //res.body.should.be.a('object');
                //res.body.length.should.be.eql(1);
            done();
        });
    })

    it("should promote a non-existent user to level 1", (done) => {
        chai.request("http://localhost:3001")
        .post( ('/user/promote'))
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({username : "cheerio"})
        .end((err, res) => {
            res.should.have.status(404);
                //res.body.should.be.a('object');
                //res.body.length.should.be.eql(1);
            done();
        });
    })
});

describe('/PUT User Profile Update', () => {
    it("should update testacc's details with correct input", (done) => {
        chai.request("http://localhost:3001")
        .put( ('/testacc/update'))
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({
            new_email: "testacc2@unsw.edu.au",
            new_password: "bbbbb2",
            new_zid: ("z5000000")
         })
        .end((err, res) => {
            res.should.have.status(200);
                //res.body.should.be.a('object');
                //res.body.length.should.be.eql(1);
            done();
        });
    })

    it("should fail to update testacc's details due to incomplete input", (done) => {

    })

    it("should fail to update a non-existent user's details", (done) => {
        
    })
});

describe('/GET User Profile', () => {
    it("should retrieve the user details of one user", (done) => {
        chai.request("http://localhost:3001")
        .get( ('/user/promote'))
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({usernames : 
            [ { username: "testacc" } ]
        })
        .end((err, res) => {
            res.should.have.status(200);
                //res.body.should.be.a('object');
                //res.body.length.should.be.eql(1);
            res.body.email.should.equal("testacc@unsw.edu.au");
            res.body.rank.should.equal(1);
            res.body.karma.should.equal(0);
            done();
        });
    })

    it("should retries the user details of multiple users", (done) => {
        chai.request("http://localhost:3001")
        .get( ('/user'))
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({usernames : [
                { username : "fluxtheory"},
                { username : "zerohedge"},
                { username: "dailystorm"},
                { username: "nonexistentUser"}
            ]
        })
        .end((err, res) => {
            res.should.have.status(200);
            /*
                FINISH THIS.
            */
            //res.body.email.should.equal("testacc@unsw.edu.au");
            res.body.rank.should.equal(3);
            res.body.karma.should.equal(0);
            done();
        });
    })
});



describe('Add/Get Friend', () => {
    it("should add 'fluxtheory' as testacc's friend", (done) => {
        chai.request("http://localhost:3001")
        .post()
        .end((err, res) => {
            res.should.have.status(200);
                //res.body.should.be.a('object');
                //res.body.length.should.be.eql(1);
            done();
        });
    })

    it("should retrieve the user 'testacc's friend list", (done) => {
        chai.request("http://localhost:3001")
        .post()
        .end((err, res) => {
            res.should.have.status(200);
                //res.body.should.be.a('object');
                //res.body.length.should.be.eql(1);
            done();
        });
    })


});

describe('/GET Course Retrieval Group', () => {

});

describe('/POST Delete User', () => {
    it("should delete user 'testacc'", (done) => {
        chai.request("http://localhost:3001")
        .post('/testacc/delete')
        .end((err, res) => {
            res.should.have.status(200);
                //res.body.should.be.a('object');
                //res.body.length.should.be.eql(1);
            done();
        });
    })

    it("should try and delete a non-existent user", (done) => {
        chai.request("http://localhost:3001")
        .post('/idontexist/delete')
        .end((err, res) => {
            res.should.have.status(404);
                //res.body.should.be.a('object');
                //res.body.length.should.be.eql(1);
            done();
        });
    })
});

/*
 * Test the /GET route
 */
/*
describe('/GET user', () => {
    it('it should GET all the users information', (done) => {
    chai.request("http://localhost:3001")
        .get('/user')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({username: "fluxtheory"})
        .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.length.should.be.eql(1);
            done();
        });
    });
});
*/
