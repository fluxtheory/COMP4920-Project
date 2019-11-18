process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
//var crypto = require("crypto");


chai.use(chaiHttp);

describe('', () => {
    chai.request("http://localhost:3001")
        .post('/testacc/delete')
        .end();    
    });


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
            res.should.have.status(500);
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
/*
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
});*/

describe('/GET User Profile', () => {
    it("should retrieve the user details of one user", (done) => {
        chai.request("http://localhost:3001")
        .get( ('/user'))
        .set('content-type', 'application/json')
        .send({usernames : "testacc"})
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
        let users = {
            usernames: [
                "fluxtheory",
                "zerohedge",
                "dailystorm",
                "nonexistentUser"
            ]
        };

        chai.request("http://localhost:3001")
        .get( ('/user'))
        .set('content-type', 'application/json')
        .send(users)
        .end((err, res) => {
            res.should.have.status(200);
            
            done();
        });
    })
});


describe('Add/Get/Remove Friend', () => {

    it("should add 'fluxtheory' as testacc's friend", (done) => {
        chai.request("http://localhost:3001")
        .post('/testacc/add-friend')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({friendname: "fluxtheory"})
        .end((err, res) => {
            res.should.have.status(200);

            chai.request("http://localhost:3001")
            .get('/fluxtheory/friends')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data[0].friendid.should.equal('testacc');
                res.body.data.length.should.equal(1);
            });

            chai.request("http://localhost:3001")
            .get('/testacc/friends')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data[0].friendid.should.equal('fluxtheory');
                res.body.data.length.should.equal(1);
            });
            
            done();
        });
    })

    it("should defriend 'testacc's from 'fluxtheory's friendlist", (done) => {
        chai.request("http://localhost:3001")
        .post('/fluxtheory/remove-friend')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({friendname: "testacc"})
        .end((err, res) => {
            res.should.have.status(200);

            chai.request("http://localhost:3001")
            .get('/fluxtheory/friends')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.length.should.equal(0);
            });

            chai.request("http://localhost:3001")
            .get('/testacc/friends')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.length.should.equal(0);  // THESE TWO LINES ARE THE PROBLEM
                
            });

            done();
        });

        
    })


});

describe('/GET Course Retrieval Group', () => {
    it("should retrieve the course list of user 'fluxtheory'", (done) => {
        chai.request("http://localhost:3001")
        .get('/fluxtheory/courses')
        .end((err, res) => {
            res.should.have.status(200);
            res.body[0].code.should.equal('COMP1911');
            res.body[1].code.should.equal('COMP3311');
            res.body[2].code.should.equal('COMP4920');
            done();
        });
    })

    it("should fail to retrieve the course list of non-existent user", (done) => {
        chai.request("http://localhost:3001")
        .get('/idontexist/courses')
        .end((err, res) => {
            res.should.have.status(404);
            done();
        });
    })
});


describe('/POST Delete User', () => {
    it("should delete user 'testacc'", (done) => {
        chai.request("http://localhost:3001")
        .post('/testacc/delete')
        .end((err, res) => {
            res.should.have.status(200);

            // check group membership
            // check course membership
            // check friendlist membership
            // check forumPosts - keep likes!

            done();
        });

        // DELETING A USER SHOULD REMOVE HIM FROM ALL GROUPS, ENROLMENTS, FRIENDLISTS. TEST THIS.
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

