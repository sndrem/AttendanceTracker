var express = require('express');
var router = express.Router();
var connection = require('../modules/connection');
var cookieParser = require('cookie-parser');
var seminarService = require("../modules/seminar-service");
var userService = require("../modules/user-service");
var courseService = require("../modules/course-service");


/* GET Dashboard page */
router.get("/dashboard", userService.requireLogin, userService.isAssistant, function(req, res, next) {
    var model = {
        title: 'Assistant dashboard'
    }
    res.render("assistantDashboard", model);
});

/* GET createNewSeminarGroup view */
router.get("/createNewSeminarGroup", userService.requireLogin, userService.isAssistant, seminarService.getAllSeminarGroups, function(req, res, next) {
    const model = {
        seminarGroups: req.seminarGroups
    }
    res.render("createNewSeminarGroup", model);
});

/* GET registerAttendance */
router.get("/registerAttendance", userService.requireLogin, userService.isAssistant, courseService.getCoursesForAssistant, function(req, res, next){
    var model = {
        title: 'Register Attendance',
        courses: req.resultSet
    }
    res.render("registerAttendance", model);
});

/* POST getSeminarsFromCourse */
router.post("/getSeminarGroupsFromCourse", userService.requireLogin, userService.isAssistant, courseService.getSeminarGroupsFromCourse, function(req, res, next) {
    res.status(200).json(req.resultSet);
});

/* POST createNewSeminarGroup */
router.post("/createNewSeminarGroup", userService.requireLogin, userService.isAssistant, seminarService.createSeminarGroup, function(req, res, next) {
    console.log("Should create a new semianr group");
    console.log(req.statusMessages);
    console.log(req.queryResult);
    if(req.statusMessages && res.statusMessages.length > 0) {
        res.status(400).json(req.statusMessages);
    } else {
        res. status(200).json(req.queryResult);
    }
});

/* GET takeAttendance */
router.get("/takeAttendance/:semGrID", userService.requireLogin, userService.isAssistant, seminarService.getAllStudentsFromGroup, function(req, res, next) {
    console.log(req.semGroupsStudents);
    res.render("takeAttendance", {"students": req.semGroupsStudents});
});

module.exports = router;