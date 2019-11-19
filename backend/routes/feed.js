const express = require("express");
const router = express.Router();
const feeddb = require("../feedDB");


// @route POST /:course/feed/post
// @desc Add/reply to a post in the course topic feed.
// @body parentId, username, content 
// @access private
router.post('/:course/feed/post', (req, res) => {
    const { parentId, username, content } = req.body;

    feeddb.addPost(username, req.params.course, content, parentId,)
    .then(reply => {
        return res.status(reply.code).json(reply);
    })
    .catch(err => {
        return res.status(err.code).json(err);
    });
});

// delete post
// @route POST /:course/feed/:id/delete
// @desc Deletes a post in the course topic feed
// @access private
router.post('/:course/feed/:id/delete', (req, res) => {
    feeddb.deletePost(req.params.id)
    .then(reply => {
        return res.status(reply.code).json(reply);
    })
    .catch(err => {
        return res.status(err.code).json(err);
    });
});

// toggle upboat poast
// @route POST /:course/feed/:id/upvote
// @desc Attaches a like to a post. Clicking again removes the like.
// @access private
router.post('/:course/feed/:id/upvote', (req, res) => {
    feeddb.upvotePost(req.params.id, req.body.username)
    .then(reply => {
        return res.status(reply.code).json(reply);
    })
    .catch(err => {
        return res.status(err.code).json(err);
    });
});

// get Course Feed
// @route GET /:course/feed
// @desc Retrieves the course feed for that particular course
// @access private
router.get('/:course/feed', (req, res) => {
    feeddb.getCourseFeed(req.params.course)
    .then(posts => {
        return res.status(200).json(posts);
    })
    .catch(err => {
        console.log(err.msg);
        return res.status(err.code).json(err);
    });
});


// edit post
// @route PUT /:course/feed/:id
// @desc Edit a post
// @body { post }
// @access private
router.put('/:course/feed/:id', (req, res) => {
    const { course, id } = req.params;
    const post = req.body.post;

    feeddb.editPost(id, post)
    .then(reply => {
        return res.status(reply.code).json(reply);
    })
    .catch(err => {
        return res.status(err.code).json(err);
    })

});

// getPost
// @route GET /:course/feed/:id
// @desc Retrieves a post based on id, useful for testing.
// @access private
router.get('/:course/feed/:id', (req, res) => {
    feeddb.getPost(req.params.id)
    .then(reply => {
        return res.status(reply.code).json(reply);
    }).catch(err => {
        return res.status(err.code).json(err);
    })
});


// toggle sticky post
// @route POST /:course/feed/id/sticky
// @desc Toggle Sticky a post
// @body { username }
// @access private
router.post('/:course/feed/:id/sticky', (req, res) => {
    const { course, id } = req.params;

    feeddb.toggleStickyPost(id, req.body.username)
    .then(reply => {
        return res.status(reply.code).json(reply);
    })
    .catch(err => {
        return res.status(err.code).json(err);
    })
});

module.exports = router;