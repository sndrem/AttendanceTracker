var express = require('express');
var router = express.Router();
var connection = require('../modules/connection');
var cookieParser = require('cookie-parser');
var seminarService = require("../modules/seminar-service");
var userService = require("../modules/user-service");
var seminarSchedule = require("../modules/seminar-schedule");


/* GET Dashboard page */
router.get("/dashboard", userService.requireLogin, userService.isAssistant, function(req, res, next) {
    var model = {
        title: 'Assistant dashboard'
    }
    res.render("assistantDashboard", model);
});

module.exports = router;