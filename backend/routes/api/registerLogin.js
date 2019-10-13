const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require('../../usersDB');
const keys = require('../../config/keys');

// Load input validation
const validateRegisterInput = require("../../validators/register");
const validateLoginInput = require("../../validators/login");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    const {errors, isValid } = validateRegisterInput(req.body);

    if(!isValid){
        console.log(res.status(400).json(errors));
        return res.status(400).json(errors);
    }

    //check if username or email exists in the database
    if(user.userExists(req.body.username)){
        console.log(req.body.username + "already exists in the db!");
        return;
    }

    //hash password
    let hashpword = bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.password, salt, (err, hash) => {
            if(err){
                console.log(err);
            }
            return hash;
        });
    });

    let newUser = {
        username: req.body.username,
        email : req.body.email,
        password : hashpword
    };

    console.log(newUser);
    //user.addUser(req.body.name, req.body.email, req.body.password)
});


// @route POST api/users/login
// @desc Login user and return JWT authentication token
// @access Public
router.post("/login", (req, res) => {

    const {errors, isValid } = validateLoginInput(req.body);

    if (!isValid){
        return res.status(400).json(errors);
    }

    //check if account exists
    let acc = user.userExists(req.body.username);

    if (!acc){
        return res.status(404).json({ error : "Username not found" });
    }

    //check password
    bcrypt.compare(req.body.password, acc.password).then(isMatch => {
        if (isMatch) {
            // JWT payload
            const payload = {
                email : acc.email,
                username : acc.username
            };

            //sign token
            jwt.sign(payload, keys.secret, {
                expiresIn : 31556926
            }, 
            (err, token) => {
                res.json({
                    success: true,
                    token: "Bearer " + token
                });
            });
        } else {
            return res.status(400).json({ error : "Password incorrect"});
        }
    });
});

module.exports = router;