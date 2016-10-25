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
    database: 'atdb',
    multipleStatements: true
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

    courseExistsCreatingSeminarGroup: function(req, res, next){
        const courseID = req.body.courseID;
        const query = "SELECT courseID FROM course WHERE courseID = ?";
        connection.query(query, [courseID], function(err, result) {
            if(err) {
                next(err);
            } else {
                if(result.length == 0) {
                   console.log("the course does not exists");
                   res.status(200).json("The course does not exists. Contact the system admin for creation of courses");
                } else {
                   next();
                }
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
                    next();
                } else {
                   console.log("allready exists");
                   res.status(200).json("the course allready exists");

                }
            }
        });
    },

    createCourse: function(req, res, next){
        var courseID = req.body.courseID;
        var name = req.body.courseName;
        var semester = req.body.semester;
        var attendance = req.body.attendancePercentage;
        
        var planned = req.body.plannedSeminars;
        
        if(planned == null || planned == ""){
            var plannedSeminars = 0;
        }else{
            var plannedSeminars = parseInt(req.body.plannedSeminars);
        }
        
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
                console.log("error ", err);
                next(err);
            } else{
                req.resultSet = result;
                next();
            }
        });

    },

    getCourseAttendance: function(req, res, next) {
        const semGrID = req.params.semGrID;
        const query = "SELECT `attendance`, `plannedSeminars`" 
                    + "FROM `course`"+
                    + "JOIN `seminargroup`"+
                    + "ON `course`.courseID = `seminargroup`.courseID"+
                    + "WHERE `seminargroup`.semGrID = ?";
        console.log("Skal hente course attendance  fra id " + semGrID);
        connection.query(query, [semGrID], function(err, result) {
            if(err) {
                next(err);
            } else 
                req.courseAttendance = result[0];
                next();
        }); 
    }

}

module.exports = courseService;