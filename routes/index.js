var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var firebase = require('firebase');
var seminarService = require("../modules/seminar-service");
var userService = require("../modules/user-service");

// Initialize Firebase
var config = {
    serviceAccount: "./attendance-tracker-service-account-key.json",
    databaseURL: "https://attendancetracker-8103e.firebaseio.com/"
};
firebase.initializeApp(config);

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

/* Login route */
router.get("/login", function(req, res, next) {
    res.render("login", {title: "Log in"});
});

/* Register route */
router.get("/register", function(req, res, next) {
    res.render("register", {title: "Create New User"});
});

/* Dashboard route */
router.get("/dashboard", authenticate, seminarService.getUserSeminars, renderSeminars);

function renderSeminars(req, res, next) {
    console.log("Printing user seminars", req.userSeminars);
    res.render("dashboard", {
        model: req.userSeminars
    });
}


/* seminarDetails */
router.get("/seminarDetails/:courseKey/:seminarKey", seminarService.getSeminarStudents, userService.getNames, function(req, res, next) {
    var seminarKey = req.params.seminarKey;
    var courseKey = req.params.courseKey;

    res.render("seminarDetails", {title: seminarKey, key: seminarKey, students: req.studentNames});
});

/* Post to save attendance */
router.post("/registerAttendance", function(req, res, next){
    var checked = req.body.studentCheckbox;
    
    res.render("registerAttendance", {title: checked});
});

/* Post to search for seminars */
router.get("/listSeminars", function(req, res, next) {
    var seminarRef = firebase.database().ref("seminars");
    seminarRef.once('value').then(function(snap){
        console.log(snap.val());
        res.send(JSON.stringify(snap.val()));
    });
});

/* Post to signUpForSeminars */
router.post("/signUpForSeminar/:courseID/:seminarID", authenticate, seminarService.addStudentToSeminar, function(req, res, next) {
    // TODO Save to database
    // return status code and text
    console.log(req.params);
    // Skal vi returnere JSON er det viktig at vi setter Content-Type til application/json
    res.setHeader('Content-Type', 'application/json');

    res.send(JSON.stringify({
        'message': "You signed up for " + req.params.seminarID + ", which belongs to " + req.params.courseID
    }));
});

/* about us route */
router.get("/about", function(req, res, next){
  res.render("about", {title: "About us"});
});

module.exports = router;
