/*
    Service for all thing courses
    Author: Sindre og Tor
    Date: 04.10.2016
*/

var mysql = require('mysql');
var userService = require("../modules/user-service")
var mysql = require('mysql');
var salt = "85478tug9efunc78ryw378e983wud";
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'atdb'
});

var courseService ={

    getCoursesForAssistant: function(req, res, next) {
        const userID = req.session.user.StudID;
        const query = "SELECT course.courseID, course.name FROM is_assistant_for "
                    + "JOIN course "
                    + "ON is_assistant_for.courseID = course.courseID "
                    + "AND is_assistant_for.StudID = ?";
        connection.query(query, [userID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.resultSet = result;
                next();
            }
        });
    },

    getAllCoursesForAssistant: function(req, res, next) {
        const userID = req.body.userID;
        const query = "SELECT `is_assistant_for`.`courseID`, course.`name` FROM `is_assistant_for` "
                    + "JOIN course "
                    + "ON `is_assistant_for`.`courseID` = course.`courseID` "
                    + "WHERE StudID = ? ";
        connection.query(query, [userID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.resultSet = result;
                next();
            }
        });
    },

    getSeminarGroupsFromCourse: function(req, res, next) {
        const courseID = req.body.courseID;
        const query = "SELECT * FROM seminargroup "
                    + "WHERE courseID = ?";
        if(courseID) {
            connection.query(query, [courseID], function(err, result) {
                if(err) {
                    next(err);
                } else {
                    req.resultSet = result;
                    next();
                }
            });
        } else {
            req.resultSet = "No course ID chosen";
            next();
        }
    },

    getAllCourses: function(req, res, next) {
        const query = "SELECT courseID, name FROM course";
        connection.query(query, function(err, result) {
            if(err) {
                next(err);
            } else {
                req.courses = result;
                next();
            }
        });
    },

    removeAssistantFromCourse: function(req, res, next) {
        const userID = req.body.userID;
        const courseID = req.body.courseID;
        const query = "DELETE FROM is_assistant_for "
                    + "WHERE StudID = ? AND courseID = ?";
        connection.query(query, [userID, courseID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.resultSet = result;
                next();
            }
        });
    },

    courseExists: function(req, res, next) {
        const courseID = req.body.courseID;
        const query = "SELECT courseID FROM course WHERE courseID = ?";
        connection.query(query, [courseID], function(err, result) {
            if(err) {
                next(err);
            } else {
                if(result.length == 0) {
                    res.status(200).json({'redirect_url': '/admin/createCourse'});
                } else {
                    next();
                }
            }
        });
    },

    createCourse: function(req, res, next){
        var courseID = req.body.courseID;
        var name = req.body.courseName;
        var semester = req.body.courseSemester;
        var attendance = req.body.attendancePercentage;
    
        var plannedSeminars = parseInt(req.body.plannedSeminars);

        console.log(plannedSeminars);

        
        var values = {
            courseID : courseID,
            name : name,
            semester : semester,
            attendance : attendance,
            plannedSeminars : plannedSeminars
        }

        const query = "INSERT INTO `course` SET ?";

        connection.query(query, values, function(err, result) {
            if(err){
               // res.status(400).json(err);
                req.message = "Course with ID " + courseID + " allready exists";
                console.log(err);
                next();
            } else{
                req.message = "Course with ID " + courseID + " is now created";
                next();
            }


        });

    }

}

module.exports = courseService;