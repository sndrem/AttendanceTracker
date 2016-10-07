var express = require('express');
var router = express.Router();
var connection = require('../modules/connection');
var cookieParser = require('cookie-parser');
var seminarService = require("../modules/seminar-service");
var userService = require("../modules/user-service");

/* GET Dashboard page */
router.get("/dashboard", userService.requireLogin, userService.isAdmin, function(req, res, next) {
    const name = req.session.user.fName + " " + req.session.user.lName;
    var model = {
        title: 'Admin dashboard',
        user: name
    }
    res.render("adminDashboard", model);
});


/* GET createNewAssistant */
router.get("/createNewAssistant", userService.requireLogin, userService.isAdmin, function(req, res, next) {
    res.render("createNewAssistant");
});


/* POST addUserAsAssistant */
router.post("/addUserAsAssistant", userService.requireLogin, userService.isAdmin, userService.registerUserAsAssistant, function(req, res, next) {
    res.status(200).json(req.message);
});

/* GET addAssistantToCourse */
router.get("/addAssistantToCourse", userService.requireLogin, userService.isAdmin, function(req, res, next) {
    res.render("addAssistantToCourse");
});


module.exports = router;