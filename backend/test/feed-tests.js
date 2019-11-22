process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();


chai.use(chaiHttp);
const server = "http://localhost:3001";


describe('/POST feed', () => {
    
    it('should create a thread in the COMP4920 course feed', (done) => {
        var root;
        chai.request(server)
        .post('/COMP4920/feed/post')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ rootId: null, branchId: null, username: 'fluxtheory', title: "Hello World", content: "Hello, I am the start of the thread"})
        .end((err, res) => {
            res.should.have.status(200);
            root = res.body.postId;

            chai.request(server)
            .post('/COMP4920/feed/post')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({ rootId: root, branchId: res.body.postId, username: 'zerohedge', title: "Re:Hello World", content: "I am the first reply"})
            .end((err, res) => {
                res.should.have.status(200);
                
                chai.request(server)
                .post('/COMP4920/feed/post')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ rootId: root, branchId: res.body.postId, username: 'fluxtheory', title: "Re:Re:Hello World", content: "I am the second reply"})
                .end((err, res) => {
                    res.should.have.status(200);
                    
                    chai.request(server)
                    .post('/COMP4920/feed/post')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send({ rootId: root, branchId: res.body.postId, username: 'bbbbb', title: "Re:Re:Re:Hello World", content: "I am the third reply"})
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    });
                });

                chai.request(server)
                .post('/COMP4920/feed/post')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ rootId: root, branchId: res.body.postId, username: 'dailystorm', title: "Re:Hello World", content: "I am the first nested reply"})
                .end((err, res) => {
                    res.should.have.status(200);
                    
                });
            })
        });     
    });
});


describe('/POST upvote and sticky feed post', () => {
    it('liking a post should increment the like count. Liking it again should decrement the like count.', (done) => {

        chai.request(server)
        .get('/COMP4920/feed/1')
        .end((err, res) => {
            res.should.have.status(200);
            kudo_count = res.body.data.kudos;

            chai.request(server)
            .post('/COMP4920/feed/1/upvote')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send({ username: 'fluxtheory'})
            .end((err, res) => {
                res.should.have.status(200);

                chai.request(server)
                .get('/COMP4920/feed/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.data.kudos.should.equal(kudo_count+1);

                    chai.request(server)
                    .post('/COMP4920/feed/1/upvote')
                    .set('content-type', 'application/x-www-form-urlencoded')
                    .send({ username: 'fluxtheory'})
                    .end((err, res) => {
                        res.should.have.status(200);

                        chai.request(server)
                        .get('/COMP4920/feed/1')
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.data.kudos.should.equal(kudo_count);
                            done();
                        })
                    })
                    
                });
            });
        });  
    });
    
    it('should sticky a post. Trying to sticky the post again should de-sticky the post', (done) => {
        chai.request(server)
        .post('/COMP4920/feed/1/sticky')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ username: 'fluxtheory'})
        .end((err, res) => {
            res.should.have.status(200);

            chai.request(server)
            .get('/COMP4920/feed/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.sticky.should.equal(1);
                
                chai.request(server)
                .post('/COMP4920/feed/1/sticky')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({ username: 'fluxtheory'})    
                .end((err, res) => {
                    res.should.have.status(200);

                    chai.request(server)
                    .get('/COMP4920/feed/1')
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.data.sticky.should.equal(0);
                        done();
                    });
                });
            });
        });
    });
});

describe('/PUT edit upvote feed posts', () => {
    it('should edit a post', (done) => {
        chai.request(server)
        .put('/COMP4920/feed/1/')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send({ post: 'Hello I am the edited first post'})
        .end((err, res) => {
            res.should.have.status(200);

            chai.request(server)
            .get('/COMP4920/feed/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.data.postContent.should.equal("Hello I am the edited first post");
                done();
            });
        })
    });

});

describe('/GET course feed posts', () => {
    it('', (done) => {
        done();
    });

    it('', (done) => {
        done();
    });
});



describe('/POST delete feed post', () => {
    it('', (done) => {
        done();
    });

    it('', (done) => {
        done();
    });

});
