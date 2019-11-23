const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../usersDB");
const keys = require("../config/keys");
const passport = require("passport");

// Load input validation
const validateRegisterInput = require("../validators/register");
const validateLoginInput = require("../validators/login");
const validateUpdateInput = require("../validators/update");
const Chatkit = require("@pusher/chatkit-server");

const chatkit = new Chatkit.default({
  instanceLocator: "v1:us1:4c1776d3-a51e-497e-8f3e-0a9f08eabf77",
  key:
    "9cc4a113-e6f1-4109-92f9-799391e959c5:NBzZCZrvWUf1bdIblQR56oGOiELvMsfJq2nyFvR6Jg0=" // This is bad, use .env vars
});

// @route POST /register
// @desc Register user
// @access Public

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  user.userExists(req.body.name).then(function(acc) {
    //check if username or email exists in the database
    if (acc.success) {
      errors.error = req.body.name + " already exists in the db!";
      return res.status(400).json(errors);
    } else {
      let newUser = {
        username: req.body.name,
        email: req.body.email,
        admin: req.body.admin,
        password: undefined
      };

      chatkit
        .createUser({
          id: req.body.name,
          name: req.body.name
        })
        .then(() => {
          console.log("Chatkit user created successfully");
        })
        .catch(err => {
          //console.error('Chatkit error on user creation', err);
        });
      //hash password
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
          if (err) {
            console.log(err);
            return res.status(500).json(err);
          }

          newUser.password = hash;

          user
            .addUser(newUser)
            .then(() => {
              return res.status(200).json({ success: true });
            })
            .catch(err => {
              if (err) {
                return res.status(500).json(err);
              }
            });
        });
      });
    }
  });
});

// @route POST /login
// @desc Login user and return JWT authentication token
// @access Public
router.post(
  "/login",
  //passport.authenticate('local',
  //{ successRedirect: "/", failureRedirect: '/login', failureFlash: true}),
  (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    //check password
    bcrypt.compare(req.body.password, reply.data.password).then(isMatch => {
      if (isMatch) {
        // JWT payload
        const payload = {
          email: reply.data.email,
          username: reply.data.username,
          isAdmin: (reply.data.rank === 1)
        };

        //sign token
        jwt.sign(payload, keys.secret,{expiresIn: 31556926}, (err, token) => {
            res.json({
              success: true,
              token,
              username: reply.data.username,
              isAdmin: payload.isAdmin
            });
          }
        );
        user.updateUser(reply.data.username, {last_login : new Date().toString()}).catch(err => {
          console.log(err);
        });
      } else {
        return res.status(403).json({ error: "Password incorrect." });
      }
    }).catch(err => {
      if(err){
        console.log(err);
      }
    });
  }).catch(err => {
    if (err) {
      return res.status(err.code).json(err);
    }
  });
});

// @route GET /logout
// @desc Logs out of an existing session
// @access Public
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// @route POST /:username/delete
// @desc Deletes the user from the service
// @access Private
router.post("/:username/delete", (req, res) => {
  const username = req.params.username;

  user
    .deleteUser(username)
    .then(reply => {
      return res.status(reply.code).json(reply);
    })
    .catch(err => {
      return res.status(err.code).json(err);
    });
});

//BROKEN AS SHIT, DO NOT USE.
// @route PUT /:username/update
// @desc Updates user profile password/email or rank.
/* @param {
            (new_last_login),
            OR
            (
              new_email (optional), 
              new_password (optional),
              new_zid (optional)
            )
          }
*/
// @access Private
router.put("/:username/update", (req, res) => {
  const { errors, isValid } = validateUpdateInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  //console.log(req.body);
  user
    .updateUser(req.params.username, req.body)
    .then(reply => {
      return res.status(reply.code).json(reply);
    })
    .catch(err => {
      return res.status(err.code).json(err);
    });
});

// @route POST /:username/karma
// @desc Directly give a user karma.
// @body { giver_username }
// @access Private
router.post("/:username/karma", (req, res) => {
  user
    .toggleKarma(req.params.username, req.body.giver_username)
    .then(reply => {
      return res.status(reply.code).json(reply);
    })
    .catch(err => {
      return res.status(err.code).json(err);
    });
});

// @route POST /:username/checkKarma
// @desc Check if a user has already given this user karma
// @body { giver_username }
// @access Private
router.post("/:username/checkKarma", (req, res) => {
  user
    .checkKarma(req.params.username, req.body.giver_username)
    .then(reply => {
      return res.status(reply.code).json(reply);
    })
    .catch(err => {
      console.log(err);
      return res.status(err.code).json(err);
    });
});

// @route GET /:username/courses
// @desc returns all the courses enrolled by a user during the current term
// @access Private
router.get("/:username/courses", (req, res) => {
  user
    .userCourses(req.params.username)
    .then(reply => {
      if (reply.code == 200) {
        return res.status(reply.code).json(reply.data);
      } else {
        return res.status(reply.code).json(reply.msg);
      }
    })
    .catch(err => {
      return res.status(err.code).json(err);
    });
});

// @route POST /:username/add-friend
// @desc Adds friend to friendlist
// @body { friendname }
// @access Private
router.post("/:username/add-friend", (req, res) => {
  user
    .addFriend(req.params.username, req.body.friendname)
    .then(reply => {
      return res.status(reply.code).json(reply);
    })
    .catch(err => {
      return res.status(err.code).json(err);
    });
});

// @route POST /:username/add-friend
// @desc defriend someone from the friendlist
// @body { friendname }
// @access Private
router.post("/:username/remove-friend", (req, res) => {
  user
    .defriend(req.params.username, req.body.friendname)
    .then(reply => {
      return res.status(reply.code).json(reply);
    })
    .catch(err => {
      return res.status(err.code).json(err);
    });
});

// @route GET /:username/friends
// @desc Retrieves the user's friend list
// @body { username }
// @access Private
router.get("/:username/friends", (req, res) => {
  user
    .getFriendList(req.params.username)
    .then(reply => {
      return res.status(reply.code).json(reply);
    })
    .catch(err => {
      if (err) {
        return res.status(err.code).json(err);
      }
    });
});

// @route GET /:username/groups
// @desc Retrieves the user's affiliated groups
// @access Private

router.get("/:username/groups", (req, res) => {
  user
    .userGroups(req.params.username)
    .then(reply => {
      return res.status(reply.code).json(reply);
    })
    .catch(err => {
      if (err) {
        return res.status(err.code).json(err);
      }
    });
});

// @route post /user
// @desc Retrieves user information from the db.
// @body { usernames = [ "user1", "user2" ... etc] }
// @access Private
router.post("/user", (req, res) => {
  user
    .getUserInfo(req.body.usernames)
    .then(reply => {
      if (reply.code == 200) {
        return res.status(reply.code).json(reply.data);
      } else {
        return res.status(reply.code).json(reply.msg);
      }
    })
    .catch(err => {
      return res.status(err.code).json(err);
    });
});

// @route POST /user
// @desc Modifies user privileges
// @body { username }
// @access Private
router.post("/user/promote", (req, res) => {
  user
    .promoteUser(req.body.username, 1)
    .then(reply => {
      return res.status(reply.code).json(reply);
    })
    .catch(err => {
      return res.status(err.code).json(err);
    });
});

router.get("/verify-token", (req, res) => {
  try {
    const decoded = jwt.verify(req.headers.authorization, keys.secret);
    return res.send({success: true, username: decoded.username, isAdmin: decoded.isAdmin, inFactHereIsEverything: decoded})
  } catch (err) {
    return res.status(401).send({ success: false, error: err });
  }
});

module.exports = router;
