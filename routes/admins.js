var express = require('express');
var router = express.Router();
var connection = require('../modules/connection');
var cookieParser = require('cookie-parser');
var seminarService = require("../modules/seminar-service");
var userService = require("../modules/user-service");
var seminarSchedule = require("../modules/seminar-schedule");

/* GET Dashboard page */
router.get("/dashboard", userService.requireLogin, function(req, res, next) {
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
    console.log(model);
    res.render("createNewSeminarGroup", model);
});


module.exports = router;