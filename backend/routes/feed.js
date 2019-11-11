const express = require("express");
const router = express.Router();
const feeddb = require("../feedDB");


// @route POST /:course/feed/post
// @desc Add/reply to a post in the course topic feed.
// @body parentId, username, content 
// @access private
router.post('/:course/feed/post', (req, res) => {
    const { parentId, username, content } = req.body;

    feeddb.addPost(parentId, username, req.params.course, content)
    .then(success => {
        if(success){
            return res.status(200).json({"success" : success});
        } else {
            return res.status(400).json({"success" : success});
        }
    })
    .catch(err => {
        return res.status(500).json(err);
    });
});

// delete post
// @route POST /:course/feed/:id/delete
// @desc Deletes a post in the course topic feed
// @access private
router.post('/:course/feed/:id/delete', (req, res) => {
    feeddb.deletePost(req.params.id)
    .then(success => {
        if(success){
            return res.status(200).json({"success" : success});
        } else {
            return res.status(400).json({"success" : success});
        }
    })
    .catch(err => {
        return res.status(500).json(err);
    });
});

// edit post
// @route PUT /:course/feed/:id/edit
// @desc Edits a post made by the user and ONLY by the user.
// @access private
//router.put();

// upboat poast
// @route POST /:course/feed/:id/upvote
// @desc Attaches a like to a post.
// @access private
router.post('/:course/feed/:id/upvote', (req, res) => {
    feeddb.upvotePost(req.params.id)
    .then(success => {
        if(success){
            return res.status(200).json({"success" : success});
        } else {
            return res.status(400).json({"success" : success});
        }
    })
    .catch(err => {
        return res.status(500).json(err);
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
        return res.status(500).json(err);
    });
});


module.exports = router;