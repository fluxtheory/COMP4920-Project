const express = require("express");
const router = express.Router();
const passport = require("passport");
const coursedb = require("../courseDB");
const isEmpty = require("is-empty");

// @route POST courses
// @desc add a course to courselist
// @access Private, requires login AND higher rank.
router.post("/add",  (req, res) => {
   let errors = {};

   if(isEmpty(req.body.code)){

   } 
   
   if(isEmpty(req.body.name)){

   }
    
});

// @route POST courses
// @desc add a courseInstance
// @access Private, requires login AND higher rank.
router.post("/addInstance", (req, res) => {

});

// @route GET courses
// @desc GET list of courses
// @access Private
router.get('/', (req, res) => {

});


module.exports = router;