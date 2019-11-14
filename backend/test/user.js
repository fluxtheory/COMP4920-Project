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

describe('/POST Delete User', () => {
    it("should delete user 'testacc'", (done) => {
        chai.request("http://localhost:3001")
        .post( ('/testacc/delete'))
        .end((err, res) => {
            res.should.have.status(200);
                //res.body.should.be.a('object');
                //res.body.length.should.be.eql(1);
            done();
        });
    })

    it("should try and delete a non-existent user", (done) => {
        chai.request("http://localhost:3001")
        .post( ('/idontexist/delete'))
        .end((err, res) => {
            res.should.have.status(404);
                //res.body.should.be.a('object');
                //res.body.length.should.be.eql(1);
            done();
        });
    })
});

describe('/POST User Promotion', () => {

});

describe('/GET User Profile', () => {

});

describe('/PUT User Profile Update', () => {

});

describe('/POST Add friend Group', () => {

});

describe('/GET Course Retrieval Group', () => {

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
