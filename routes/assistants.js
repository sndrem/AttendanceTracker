var express = require('express');
var moment = require('moment');
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
    console.log("Should create a new seminar group");
    console.log(req.statusMessages);
    console.log(req.queryResult);
    if(req.statusMessages && res.statusMessages.length > 0) {
        res.status(400).json(req.statusMessages);
    } else {
        res. status(200).json(req.queryResult);
    }
});

/* GET takeAttendance */
router.get("/takeAttendance/:semGrID", userService.requireLogin, userService.isAssistant, seminarService.getAllStudentsFromGroup, seminarService.getPreviousSeminars, seminarService.getLocations, function(req, res, next) {
    res.render("takeAttendance", {
        "students": req.semGroupsStudents,
        "semGrID": req.params.semGrID,
        "previousSeminars": req.previousSeminars,
        "locations": req.locations
    });
});

/* POST takeAttendance */
router.post("/takeAttendance/:semGrID", userService.requireLogin, userService.isAssistant, seminarService.createSeminar, seminarService.registerAttendanceForGroup, function(req, res, next) {
    res.status(200).send(JSON.stringify(req.seminarInsertId));
});

router.post("/updateAttendance/:semGrID", userService.requireLogin, userService.isAssistant, seminarService.updateSeminar, seminarService.updateAttendanceForGroup, function(req, res, next) {
    res.status(200).json(req.resultSet);
});

router.post("/previousSeminar/:prevSemId", userService.requireLogin, userService.isAssistant, seminarService.getPreviousAttendance, function(req, res, next) {
    res.status(200).json(req.previousAttendance);
});

router.get("/previousSeminars/:semGrID/:prevSemId", userService.requireLogin, userService.isAssistant, seminarService.getPreviousSeminars, seminarService.getPreviousAttendance, seminarService.getPlaceOfSeminar, seminarService.getLocations, function(req, res, next){
    var date = req.previousAttendance.length > 0 ? req.previousAttendance[0].date : null
    var cancelled = req.previousAttendance.length > 0 ? req.previousAttendance[0].cancelled : false
    res.render("previousAttendance", {
        "students": req.previousAttendance,
        "semGrID": req.params.semGrID,
        "previousSeminars": req.previousSeminars,
        "prevSemID": req.params.prevSemId,
        "place": req.seminarPlace,
        "date": moment(date).format("DD/MM/YYYY HH:mm"),
        "cancelled": cancelled,
        "locations": req.locations
    });
});

router.get("/attendanceStatus/:semGrID", userService.requireLogin, userService.isAssistant, seminarService.getAllAttendanceInfoForStudentsFromGroups, seminarService.getTotalSeminarsForSeminarGroup, function(req, res, next) {
    var model = {
        title: 'Attendance Status',
        students: req.semGroupsStudents,
        numOfSeminars: req.totalSeminars
    }
    console.log(model);
    res.render("attendanceStatus", model);
});


module.exports = router;