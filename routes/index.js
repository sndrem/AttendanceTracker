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
router.post("/login", userService.authenticate, function(req, res, next) {
    res.status(200).send("All okay. Carry on my son...");
});

/* GET Dashboard page */
router.get("/dashboard", userService.requireLogin, seminarService.getUserSeminarGroups, function(req, res, next) {
    var model = {
        title: 'Dashboard',
        seminars: req.seminarGroups
    }
    res.render("dashboard", {'model': model});
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


module.exports = router;
