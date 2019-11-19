const express = require("express");
const router = express.Router();
const passport = require("passport");
const coursedb = require("../courseDB");
const isEmpty = require("is-empty");
const Chatkit = require("@pusher/chatkit-server");

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:4c1776d3-a51e-497e-8f3e-0a9f08eabf77",
  key:
    "9cc4a113-e6f1-4109-92f9-799391e959c5:NBzZCZrvWUf1bdIblQR56oGOiELvMsfJq2nyFvR6Jg0=" // This is bad, use .env vars
});

// @route POST courses
// @desc add a course to courselist
/* @param {
            code - e.g. "COMP1917"    
            name - e.g. "Computing 1"
          }
*/
// @access Private, requires login AND higher rank.
router.post("/course", (req, res) => {
  //SINCE THIS IS AN INTERNAL API METHOD, I WILL TRUST THAT YOU ENTER LEGIT INFO ONLY.
  // Adding a course automatically adds 3 courseInstances to the table - one for each term, so dont worry about that.

  if (isEmpty(req.body.code)) {
    return res.status(400).json({ error: "Course code required" });
  }

  if (isEmpty(req.body.name)) {
    return res.status(400).json({ error: "Course name required." });
  }

  coursedb
    .addCourse(req.body.code, req.body.name)
    .then(success => {
      if (success) {
        return res.status(200).json({ success: true });
      } else {
        return res.status(400).json({ error: "Course already exists!" });
      }
    })
    .catch(err => {
      return res.status(400).json(err);
    });
});

// @route GET courses
// @desc GET list of courses
/* @param {
        prefix (optional) - e.g. "COMP"
        }
*/

// @access Private
router.get("/course", (req, res) => {
  coursedb
    .getCourses(req.body.prefix)
    .then(rows => {
      return res.status(200).json(rows);
    })
    .catch(err => {
      return res.status(500).json(err);
    });
});

// @route POST /:course/enrol/
// @desc Enrols a user into a course instance
/* @param {
    username - e.g. "johnwickfortnite"
        }*/
// @access Private
router.post('/:course/enrol', (req, res) => {
    const username  = req.body.username;
    const course = req.params.course;
    console.log(username, course);
    // make sure user exists?
    coursedb.addUsertoCourseInstance(username, course).then(success => {
        if(success){
          chatkit
          .addUsersToRoom({
            roomId: course + "_public",
            userIds: [username]
          })
          .then(() => console.log("added"))
          .catch(err => console.error(err));
            return res.status(200).json({ success: true });
        } else {
            return res.status(400).json({ success: false });
        }
    }).catch(err => {
        return res.status(500).json(err);
    });
});

// @route GET /:course/users
// @desc returns all the users enrolled in the current course instance
// @access Private
router.get("/:course/users", (req, res) => {
  coursedb
    .courseUsers(req.params.course)
    .then(reply => {
      return res.status(reply.code).json(reply.data);
    })
    .catch(err => {
      return res.status(err.code).json(err);
    });
});

// @route GET
// @desc returns all users using Kudo this term
// @access Private
router.get("/users", (req, res) => {
  coursedb
    .allUsers()
    .then(rows => {
      return res.status(200).json(rows);
    })
    .catch(err => {
      return res.status(500).json(err);
    });
});

// @route GET /:course/assignment
// @desc returns all the assignment deadlines of a particular course instance
// @access Private
router.get("/:course/assignment", (req, res) => {
  coursedb
    .getCourseDeadlines(req.params.course)
    .then(reply => {
      if (reply.success) {
        return res.status(reply.code).json(reply.data);
      }
      return res.status(reply.code).json(reply.msg);
    })
    .catch(err => {
      return res.status(err.code).json(err.msg);
    });
});

// @route POST /:course/assignment
// @desc Adds an assignment deadline to a course instance.
/* @body { 
            user: string,
            title: string,
            desc: string,
            dateFrom: date,
            dateTo: date
        }
*/
// @access Private
router.post("/:course/assignment", (req, res) => {
  coursedb
    .addCourseDeadline(req.params.course, req.body, req.body.user)
    .then(reply => {
      return res.status(reply.code).json(reply);
    })
    .catch(err => {
      return res.status(err.code).json(err);
    });
});

module.exports = router;
