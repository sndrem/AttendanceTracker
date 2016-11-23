var express = require('express');
var router = express.Router();
var connection = require('../modules/connection');
var cookieParser = require('cookie-parser');
var seminarService = require("../modules/seminar-service");
var userService = require("../modules/user-service");
var courseService = require('../modules/course-service');

/* GET Dashboard page */
router.get("/dashboard", userService.requireLogin, userService.isAdmin, function(req, res, next) {
    const name = req.session.user.fName + " " + req.session.user.lName;
    var model = {
        title: 'Admin dashboard',
        user: name
    }
    res.render("adminDashboard", model);
});


/* GET createNewAssistant */
router.get("/createNewAssistant", userService.requireLogin, userService.isAdmin, userService.getAllAssistants, userService.getAllUsers, function(req, res, next) {
    var model = {
        assistants: req.assistants,
        users: req.allUsers
    }
    res.render("createNewAssistant", model);
});


/* POST addUserAsAssistant */
router.post("/addUserAsAssistant", userService.requireLogin, userService.isAdmin, userService.registerUserAsAssistant, function(req, res, next) {
    res.status(200).json(req.message);
});

/* GET addAssistantToCourse */
router.get("/addAssistantToCourse", userService.requireLogin, userService.isAdmin, userService.getAllAssistants, courseService.getAllCourses, function(req, res, next) {
    var model = {
        "courses": req.courses,
        "assistants": req.assistants
    }
    res.render("addAssistantToCourse", {"model": model});
});

/*GET removeAssistantFromCourse */
router.get("/removeAssistantFromCourse", userService.requireLogin, userService.isAdmin, userService.getAllAssistants, function(req, res, next) {
    var model = {
        "assistants": req.assistants
    }
    res.render("removeAssistantFromCourse", {"model": model});
});

/* POST removeAssistantFromCourse */
router.post("/removeAssistantFromCourse", userService.requireLogin, userService.isAdmin, courseService.removeAssistantFromCourse, function(req, res, next) {
    res.status(200).json(req.resultSet);
});

router.post("/removeAssistant", userService.requireLogin, userService.isAdmin, courseService.removeAssistant, function(req, res, next) {
    res.status(200).json("Success");
});

/* POST add assistant to course */
router.post("/addAssistantToCourse", userService.requireLogin, userService.isAdmin, userService.registerAssistantToCourse, function(req, res, next) {
    res.status(200).json(req.resultSet);
});

/* GET createNewCourse */
router.get("/createCourse", userService.requireLogin, userService.isAdmin, courseService.getAllCourses, function(req, res, next) {
    var model = {
        courses: req.courses
    }
    res.render("createCourse", model);
});

router.post("/createCourse", userService.requireLogin, userService.isAdmin, courseService.courseExists, courseService.createCourse, function(req, res,next){
    res.status(200).json("Course created");
});

router.get("/editCourse/:courseID", userService.requireLogin, userService.isAdmin, courseService.getSpecificCourse, function(req, res, next) {
    res.render("editCourse", {course: req.courseDetails});
});

router.post("/updateCourse", userService.requireLogin, userService.isAdmin, courseService.updateCourse);

router.post("/deleteCourse", userService.requireLogin, userService.isAdmin, courseService.deleteCourse, function(req, res, next) {
    res.status(200).json({"redirect_url": "/admin/createCourse"});
});


module.exports = router;