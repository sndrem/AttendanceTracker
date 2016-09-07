var express = require('express');
var router = express.Router();
var cookieParser = require('cookie-parser');
var firebase = require('firebase');
// Initialize Firebase
var config = {
	serviceAccount: "./attendanceTracker-service-key.json",
	databaseURL: "https://chat-application-1e611.firebaseio.com/"
};
firebase.initializeApp(config);

function authenticate(req, res, next) {
	var idToken = req.cookies.token;
	if(idToken) {
		firebase.auth().verifyIdToken(idToken).then(function(decodedToken) {
		  var uid = decodedToken.uid;
		  req.user = decodedToken;
		  res.locals.isLoggedIn = true;
		  next();
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
  res.render('index', { "title": 'Tregas' });
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
router.get("/dashboard", authenticate, function(req, res, next) {
	res.render("dashboard", {title: "Velkommen", user: req.user.email});
});

module.exports = router;
