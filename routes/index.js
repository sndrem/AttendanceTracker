var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var firebase = require('firebase');
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
router.get("/dashboard", authenticate, getSeminars, renderSeminars);

function renderSeminars(req, res, next) {
    res.render("dashboard", {
        model: req.viewModel
    });
}

function getSeminars(req, res, next) {
    var seminarRef = firebase.database().ref("seminars");
    var viewModel = {
        user: req.user.email,
        seminars: [],
        title: "Velkommen"
    };
    req.viewModel = viewModel;

    seminarRef.once('value').then(function(snap){
        console.log("Printer verdien", snap.val());
        req.viewModel.seminars = snap.val();
        next();
    });
}

/* seminarDetails */
router.get("/seminarDetails:seminarKey", function(req, res, next){

    var key = req.params.seminarKey;
    var keyLength = key.length;
    var miniKey = key.substring(1,keyLength);

    res.render("seminarDetails", {title: "bob", key: miniKey});
});


/* about us route */
router.get("/about", function(req, res, next){
  res.render("about", {title: "About us"});
});

module.exports = router;
