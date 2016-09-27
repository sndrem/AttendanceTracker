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
        'message': "A user with student ID " + req.body.studentID + " already exists."
    }
    console.log(message);
    res.status(200).json(message);

});

/* GET Dashboard page */
router.get("/dashboard", function(req, res, next) {
    res.render("dashboard", {'title': 'Dashboard'});
});


module.exports = router;
