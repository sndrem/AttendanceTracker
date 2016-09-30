var express = require('express');
var router = express.Router();
var connection = require('../modules/connection');
var cookieParser = require('cookie-parser');
var seminarService = require("../modules/seminar-service");
var userService = require("../modules/user-service");
var seminarSchedule = require("../modules/seminar-schedule");


connection.connect();



/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { "title": 'Tregas'});  
});

/* GET register page */
router.get('/register', function(req, res, next) {
    res.render("register", {'title': "Registration"});
});

/* GET login page */
router.get('/login', function(req, res, next) {
    res.render('login', {'title': "Log in"});
});

/* GET logout page */
router.get("/logout", function(req, res, next) {
    req.session.reset();
    res.redirect("/");
});



/* POST registration page */
router.post('/register', userService.registerUser, function(req, res, next) {
    var message = {
        'sqlMessage': JSON.stringify(res.message),
        'message': res.message
    }
    console.log(message);
    res.status(200).json(message);

});

/* POST login page */
router.post("/login", userService.authenticate, userService.isAdmin, function(req, res, next) {
    res.status(200).send("All okay. Carry on my son...");
});

/* GET Dashboard page */
router.get("/dashboard", userService.requireLogin, userService.isAdmin, seminarService.getUserSeminarGroups, function(req, res, next) {
    var model = {
        title: 'Dashboard',
        seminars: req.seminarGroups,
        user: req.session.user
    }
    res.render("dashboard", model);
});

/* GET list all seminars */
router.get("/listSeminars", userService.requireLogin, seminarService.getAllSeminarGroups, function(req, res, next) {
    console.log("Getting all seminars", req.seminarGroups);
    res.status(200).send(req.seminarGroups);
});

/* POST Signup for seminar */
router.post("/signUpForSeminar/:semGrID", userService.requireLogin, seminarService.addUserToSeminar, function(req, res, next) {
    // Should add data to is_in_seminar_group table
    // TODO Need to collect the user id. Perhaps from a session variable.
    console.log(req.seminarAdded);
    res.status(200).send("Seminar added");
});

/* GET remove seminar */
router.get("/removeSeminar/:semGrID", userService.requireLogin, seminarService.removeUserFromSeminar, function(req, res, next) {
    res.redirect("/dashboard");
});

/* GET Seminar details for student */
router.get("/seminarDetails/:semGrID", userService.requireLogin, seminarService.getSeminarGroupDetails, seminarService.getSeminarDetails, seminarService.getNumberOfSeminarsForStudent, function(req, res, next) {
    console.log(req.seminarDetails);
    var values = {
        title: 'Seminar details',
        seminar: req.seminarDetails,
        groupDetails: req.seminarGroupDetails
    }
    console.log(values);
    res.render("seminarDetails", values);
});


module.exports = router;
