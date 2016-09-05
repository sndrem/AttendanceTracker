var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Tregas' });
});

/* Login route */
router.get("/login", function(req, res, next) {
	res.render("login", {title: "Log in"});
});

/* Register route */
router.get("/register", function(req, res, next) {
	res.render("register", {title: "Create New User"});
});

module.exports = router;
