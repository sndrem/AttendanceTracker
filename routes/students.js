var express = require('express');
var router = express.Router();
var connection = require('../modules/connection');
var cookieParser = require('cookie-parser');
var courseService = require("../modules/course-service");
var seminarService = require("../modules/seminar-service");
var userService = require("../modules/user-service");

/* GET Dashboard page */
router.get("/dashboard", userService.requireLogin, seminarService.getUserCourses, function(req, res, next) {
    var model = {
        title: 'Dashboard',
        courses: req.userCourses,
        user: req.session.user
    }
    res.render("dashboard", model);
});

/* GET list all seminars */
router.post("/listSeminars", userService.requireLogin, seminarService.getAllSeminarGroupsFromCourseIDExcludingUserID, function(req, res, next) {
    res.status(200).send(req.resultSet);
});

/* GET list all courses */
router.get("/listCourses", userService.requireLogin, seminarService.getAllCourses, function(req, res, next) {
    res.status(200).send(req.courses);
});

/* POST Signup for seminar */
router.post("/signUpForSeminar/:semGrID", userService.requireLogin, seminarService.addUserToSeminar, seminarService.addUserToCourse, function(req, res, next) {
    res.status(200).send("Seminar added");
});

/* GET remove seminar */
router.get("/removeSeminar/:semGrID", userService.requireLogin, seminarService.removeUserFromSeminar, function(req, res, next) {
    res.redirect("/student/dashboard");
});

/* GET Seminar details for student */
router.get("/seminarDetails/:courseID", userService.requireLogin, seminarService.getCourseDetails, seminarService.getSeminarGroupsForCourse, seminarService.getAllAttendanceForCourseForStudent, seminarService.getSeminarDetails, seminarService.getNumberOfSeminarsForStudent, seminarService.getAbsenceOfSeminarForStudent, seminarService.getTotalMinutesOfPlannedSeminars, courseService.getCourseAttendance, function(req, res, next) {
    var values = {
        title: 'Seminar Details',
        attendances: req.studentAttendance,
        groupDetails: req.courseDetails,
        courseDetails: req.courseAttendance,
        seminarGroups: req.seminarGroups,
        absenceDetails: req.numOfAbsence,
        totalPlanned: req.totalPlanned
    }
    console.log(values);
    res.render("seminarDetails", values);
});

module.exports = router;