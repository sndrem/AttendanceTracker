var express = require('express');
var router = express.Router();
var connection = require('../modules/connection');
var cookieParser = require('cookie-parser');
var seminarService = require("../modules/seminar-service");
var userService = require("../modules/user-service");
var courseService = require("../modules/course-service");
var seminarSchedule = require("../modules/seminar-schedule");


/* GET Dashboard page */
router.get("/dashboard", userService.requireLogin, userService.isAssistant, function(req, res, next) {
    var model = {
        title: 'Assistant dashboard'
    }
    res.render("assistantDashboard", model);
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

module.exports = router;