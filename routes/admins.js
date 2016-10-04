var express = require('express');
var router = express.Router();
var connection = require('../modules/connection');
var cookieParser = require('cookie-parser');
var seminarService = require("../modules/seminar-service");
var userService = require("../modules/user-service");
var seminarSchedule = require("../modules/seminar-schedule");

/* GET Dashboard page */
router.get("/dashboard", userService.requireLogin, userService.isAdmin, function(req, res, next) {
    const name = req.session.user.fName + " " + req.session.user.lName;
    var model = {
        title: 'Admin dashboard',
        user: name
    }
    res.render("adminDashboard", model);
});

/* GET createNewSeminarGroup view */
router.get("/createNewSeminarGroup", userService.requireLogin, userService.isAdmin, seminarService.getAllSeminarGroups, function(req, res, next) {
    const model = {
        seminarGroups: req.seminarGroups
    }
    res.render("createNewSeminarGroup", model);
});

/* POST createNewSeminarGroup */
router.post("/createNewSeminarGroup", userService.requireLogin, userService.isAdmin, seminarService.createSeminarGroup, function(req, res, next) {
    console.log("Should create a new semianr group");
    console.log(req.statusMessages);
    console.log(req.queryResult);
    if(req.statusMessages && res.statusMessages.length > 0) {
        res.status(400).json(req.statusMessages);
    } else {
        res. status(200).json(req.queryResult);
    }
});

/* GET createNewAssistant */
router.get("/createNewAssistant", userService.requireLogin, userService.isAdmin, function(req, res, next) {
    res.render("createNewAssistant");
});

/* POST checkExistingUser */
router.post("/checkExistingUser", userService.requireLogin, userService.isAdmin, userService.checkExistingUser, function(req, res, next) {
    // TODO Return data to client
    res.status(200).json(req.resultSet);
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