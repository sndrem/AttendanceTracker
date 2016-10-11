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
    }
}

module.exports = courseService;