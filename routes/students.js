var express = require('express');
var router = express.Router();
var connection = require('../modules/connection');
var cookieParser = require('cookie-parser');
var seminarService = require("../modules/seminar-service");
var userService = require("../modules/user-service");
var seminarSchedule = require("../modules/seminar-schedule");

/* GET Dashboard page */
router.get("/dashboard", userService.requireLogin, seminarService.getUserSeminarGroups, function(req, res, next) {
    var model = {
        title: 'Dashboard',
        seminars: req.seminarGroups,
        user: req.session.user
    }
    res.render("dashboard", model);
});

/* GET list all seminars */
router.get("/listSeminars", userService.requireLogin, seminarService.getAllSeminarGroups, function(req, res, next) {
    res.status(200).send(req.seminarGroups);
});

/* POST Signup for seminar */
router.post("/signUpForSeminar/:semGrID", userService.requireLogin, seminarService.addUserToSeminar, function(req, res, next) {
    res.status(200).send("Seminar added");
});

/* GET remove seminar */
router.get("/removeSeminar/:semGrID", userService.requireLogin, seminarService.removeUserFromSeminar, function(req, res, next) {
    res.redirect("/dashboard");
});

/* GET Seminar details for student */
router.get("/seminarDetails/:semGrID", userService.requireLogin, seminarService.getSeminarGroupDetails, seminarService.getSeminarDetails, seminarService.getNumberOfSeminarsForStudent, function(req, res, next) {
    var values = {
        title: 'Seminar details',
        seminar: req.seminarDetails,
        groupDetails: req.seminarGroupDetails
    }
    res.render("seminarDetails", values);
});

module.exports = router;