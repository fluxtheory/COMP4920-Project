const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../usersDB");
const keys = require("../config/keys");
const passport = require('passport');

// Load input validation
const validateRegisterInput = require("../validators/register");
const validateLoginInput = require("../validators/login");
const validateUpdateInput = require("../validators/update");

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
    if (acc) {
      errors.error = req.body.name + " already exists in the db!";
      return res.status(400).json(errors);
    } else {
      let newUser = {
        username: req.body.name,
        email: req.body.email,
        password: undefined
      };

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
            .catch(err => {
              if (err) {
                return res.status(500).json(err);
              }
            })
            .then(() => {
              return res.status(200).json({ success: true });
            });
        });
      });
    }
  });
}); // returns in a promise chain is a TOP LEVEL RETURN.

// @route POST /login
// @desc Login user and return JWT authentication token
// @access Public
router.post("/login", 
  //passport.authenticate('local',
  //{ successRedirect: "/", failureRedirect: '/login', failureFlash: true}),
  (req, res) => {
    
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  //check if account exists
  user
    .userExists(req.body.nameOrEmail)
    .catch(err => {
      if (err) {
        return res.status(500).json(err);
      }
    })
    .then(acc => {
      if (!acc) {
        return res.status(404).json({ error: "Username not found." });
      }

      //check password
      bcrypt.compare(req.body.password, acc.password).then(isMatch => {
        if (isMatch) {
          // JWT payload
          const payload = {
            email: acc.email,
            username: acc.username
          };

          //sign token
          jwt.sign(payload, keys.secret,{expiresIn: 31556926}, (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } else {
          user.updateUser({username: acc.username, last_login : new Date().toString()});
          return res.status(400).json({ error: "Password incorrect." });
        }
      });
    });
});

// @route GET /logout
// @desc Logs out of an existing session
// @access Public
router.get('/logout',  (req, res) => {
  req.logout();
  res.redirect('/');
});


// @route GET /:username/delete
// @desc Deletes the user from the service
// @access Private
router.get('/:username/delete', (req, res) => {
  let username = req.params.username;

  user.userExists(username).then(exists => {
    if(!exists){
      return res.status(404).json({error: "username does not exist"});
    }
  });


  user.deleteUser(username).catch(err => {
    return res.status(500).json(err);
  }).then( success => {
    if(success){
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json( {success: false});
    }
  });
});


// @route POST /:username/update
// @desc Updates user profile password/email or rank.
// @access Private
router.post('/:username/update', (req, res) => {

  const { errors, isValid } = validateUpdateInput(req.body);

  if(!isValid){
    return res.status(400).json(errors);
  }

  req.body.username = req.params.username;

  user.updateUser(req.body).catch(err => {
    return res.status(500).json(err);
  }).then( success => {
    if(success){
      return res.status(200).json({ success: true });
    } else {
      return res.status(500).json( {success: false});
    }
  });
});


module.exports = router;
