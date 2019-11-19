process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();


chai.use(chaiHttp);
const server = "http://localhost:3001";


describe('/POST Group Creation', () => {
    it('should create two groups called the "Three Musketeers" and "OwnerLeaveGroupTest" in COMP4920', (done) => {

        chai.request(server)
        .post('/COMP4920/group')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ username: 'fluxtheory', group_name: "Three Musketeers"})
        .end((err, res) => {
            res.should.have.status(200);

            chai.request(server)
            .get('/COMP4920/group')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.include({name: 'Three Musketeers'})

                chai.request(server)
                .get('/COMP4920/group-users?group=Three Musketeers')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.include({username: "fluxtheory"});
                })
            })
        })

        chai.request(server)
        .post('/COMP4920/group')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ username: 'fluxtheory', group_name: "OwnerLeaveGroupTest"})
        .end((err, res) => {
            res.should.have.status(200);

            chai.request(server)
            .get('/COMP4920/group')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.include({name: 'OwnerLeaveGroupTest'})

                chai.request(server)
                .get('/COMP4920/group-users?group=OwnerLeaveGroupTest')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.include({username: "fluxtheory"});
                    done();
                })
            })  
        })
    })  
})

describe('/GET User affiliated groups', () => {
    it('should return the groups that "fluxtheory" is a part of', (done) => {
        chai.request(server)
        .get('/COMP4920/group?user=fluxtheory')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.include({name: 'Three Musketeers'});
            res.body.should.include({name: 'OwnerLeaveGroupTest'});
            done();
        })
    })
})

describe('/POST Group Add Members', () => {
    it('should add two more group members to OwnerLeavesGroupTest', (done) => {
        chai.request(server)
        .post('/COMP4920/group/add')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ username: 'bbbbb', group_name: "OwnerLeaveGroupTest"})
        .end((err, res) => {
            
            res.should.have.status(200);

            chai.request(server)
            .get('/COMP4920/group-users?group=OwnerLeaveGroupTest')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.include({username: 'bbbbb'})
            })
        })

        chai.request(server)
        .post('/COMP4920/group/add')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ username: 'zerohedge', group_name: "OwnerLeaveGroupTest"})
        .end((err, res) => {
            
            res.should.have.status(200);

            chai.request(server)
            .get('/COMP4920/group-users?group=OwnerLeaveGroupTest')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.include({username: 'zerohedge'})
                done();
            })
        })
    })
})
/*
describe('/POST Group Remove Members', () => {

    it('should remove the user "bbbbb" from OwnerLeavesGroupTest', (done) => {
        chai.request(server)
        .post('/COMP4920/group/remove')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ username: 'bbbbb', group_name: "OwnerLeaveGroupTest"})
        .end((err, res) => {
            res.should.have.status(200);
            
            chai.request(server)
            .get('/COMP4920/group-users?group=OwnerLeaveGroupTest')
            .end((err, res) => {
                
                res.should.have.status(200);
                res.body.should.not.include({username: 'bbbbb'});
                done();
            })
            done();
        })
    })
    
    it('should promote "zerohedge" to owner after "fluxtheory" leaves OwnerLeavesGroupTest', (done) => {
        chai.request(server)
        .post('/COMP4920/group/remove')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ username: 'fluxtheory', group_name: "OwnerLeaveGroupTest"})
        .end((err, res) => {
            res.should.have.status(200);
            
            chai.request(server)
            .get('/COMP4920/group-users?group=OwnerLeaveGroupTest')
            .end((err, res) => {
                res.should.have.status(200);
                console.log(res.body);
                done();
            })
            

        })
    })

    it('should disband the group after the last member leaves', (done) => {

        chai.request(server)
        .get('/COMP4920/group')
        .end((err, res) => {
            res.should.have.status(200);
            res.body.should.not.include({name: 'Three Musketeers'});
            done();
        })
        
    })
})*/

// groupUsers not being cleaned up!

describe('/POST Group Deletion', () => {
    it('should delete the group "Three Musketeers" in COMP4920', (done) => {
        
        chai.request(server)
        .post('/COMP4920/delete-group')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ group_name: "Three Musketeers"})
        .end((err, res) => {
            res.should.have.status(200);

            chai.request(server)
            .get('/COMP4920/group')
            .end((err, res) => {
                
                res.should.have.status(200);
                res.body.should.not.include({name: 'Three Musketeers'})
                done();
            })
        })

        chai.request(server)
        .post('/COMP4920/delete-group')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ group_name: "OwnerLeaveGroupTest"})
        .end();
    })

    
})
