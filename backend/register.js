const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const user = require('./users');

// Load input validation
const validateRegisterInput = require("./validators/register");
const validateLoginInput = require("./validators/login");

// Load User model
//const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    const {errors, isValid } = validateRegisterInput(req.body);

    if(!isValid){
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