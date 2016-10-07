// Here is code which can be used by either master admins or student assistans. We store them
// under the /common path for common tasks that both can achieve
var express = require('express');
var router = express.Router();
var connection = require('../modules/connection');
var cookieParser = require('cookie-parser');
var seminarService = require("../modules/seminar-service");
var userService = require("../modules/user-service");



/* GET createNewSeminarGroup view */
router.get("/createNewSeminarGroup", userService.requireLogin, userService.isAdminOrAssistant, seminarService.getAllSeminarGroups, function(req, res, next) {
    const model = {
        seminarGroups: req.seminarGroups
    }
    res.render("createNewSeminarGroup", model);
});

/* POST createNewSeminarGroup */
router.post("/createNewSeminarGroup", userService.requireLogin, userService.isAdminOrAssistant, seminarService.createSeminarGroup, function(req, res, next) {
    console.log("Should create a new semianr group");
    console.log(req.statusMessages);
    console.log(req.queryResult);
    if(req.statusMessages && res.statusMessages.length > 0) {
        res.status(400).json(req.statusMessages);
    } else {
        res. status(200).json(req.queryResult);
    }
});

/* POST checkExistingUser */
router.post("/checkExistingUser", userService.requireLogin, userService.isAdminOrAssistant, userService.checkExistingUser, function(req, res, next) {
    // TODO Return data to client
    res.status(200).json(req.resultSet);
});


module.exports = router;