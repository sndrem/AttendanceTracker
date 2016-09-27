var express = require('express');
var router = express.Router();
var connection = require('../modules/connection');
var cookieParser = require('cookie-parser');
var seminarService = require("../modules/seminar-service");
var userService = require("../modules/user-service");
var seminarSchedule = require("../modules/seminar-schedule");

connection.connect();

function authenticate(req, res, next) {
    var idToken = req.cookies.token;
    if(idToken) {
        firebase.auth().verifyIdToken(idToken).then(function(decodedToken) {
          var uid = decodedToken.uid;
          req.user = decodedToken;
          return next();
        }).catch(function(error) {
          // Handle error
          console.log("Could not verify token");
          res.send("Du må være logget inn for å se denne siden");
        });
    } else {
        res.redirect("/");
    }
}


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
    console.log(req.message);
    res.status(200).send(req.message);
});

/* GET Dashboard page */
router.get("/dashboard", seminarService.getAllSeminarGroups, function(req, res, next) {
    console.log(req.seminarGroups);
    var model = {
        title: 'Dashboard',
        seminars: req.seminarGroups
    }
    res.render("dashboard", {'model': model});
});

/* GET list all seminars */
router.get("/listSeminars", seminarService.getAllSeminarGroups, function(req, res, next) {
    res.status(200).send(req.seminarGroups);
});

/* POST Signup for seminar */
router.post("/signUpForSeminar/:semGrID", function(req, res, next) {
    // Should add data to is_in_seminar_group table
    // TODO Need to collect the user id. Perhaps from a session variable.
    res.json(JSON.stringify("This should create a connection between the user and the seminar group with id " + req.params.semGrID + " to the database"));
});


module.exports = router;
