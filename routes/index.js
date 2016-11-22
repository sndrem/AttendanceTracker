var express = require('express');
var router = express.Router();
var connection = require('../modules/connection');
var cookieParser = require('cookie-parser');
var seminarService = require("../modules/seminar-service");
var userService = require("../modules/user-service");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { "title": 'Foribus'});
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

/* GET about page */
router.get("/about", function(req, res, next) {
    res.render("about");
})

/* POST registration page */
router.post('/register', userService.registerUser, function(req, res, next) {
    res.status(200).json(req.resultSet);
});

/* POST login page */
router.post("/login", userService.authenticate, userService.checkAdminStatus, function(req, res, next) {
    var data = {
        redirect_url: req.redirect_url
    }
    res.status(200).json(data);
});

router.get("/updateProfile", userService.requireLogin, function(req, res, next) {
    res.render("updateProfile");
});

router.post("/updateProfile", userService.requireLogin, userService.updateUserProfile, function(req, res, next) {
    res.status(200).json(JSON.parse(req.body.user));
});


module.exports = router;
