/*
    Service for all thing courses
    Author: Sindre og Tor
    Date: 04.10.2016
*/

var userService = require("../modules/user-service");
var salt = "85478tug9efunc78ryw378e983wud";
var connection = require('../modules/connection');

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
        const query = "SELECT seminargroup.semGrID, courseID, name, count(`is_in_seminar_group`.`StudID`) as numOfStudents FROM seminargroup "
                    + "LEFT JOIN `is_in_seminar_group` "
                    + "ON seminargroup.`semGrID` = `is_in_seminar_group`.`semGrID` "
                    + "WHERE courseID = ? "
                    + "GROUP BY seminargroup.`semGrID`";
        if(courseID) {
            connection.query(query, [courseID], function(err, result) {
                if(err) {
                    next(err);
                } else {
                    console.log(result);
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
        const query = "SELECT * FROM course ORDER BY courseID";
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

    removeAssistant: function(req, res, next) {
        const userID = req.body.StudID;
        const query = "DELETE FROM admins WHERE id = ?";
        connection.query(query, [userID], function(err, result) {
            if(err) {
                next(err);
            } else {
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
                   res.status(200).json("The course already exists");

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
        connection.query(query, [semGrID], function(err, result) {
            if(err) {
                next(err);
            } else 
                req.courseAttendance = result[0];
                next();
        }); 
    },

    getSpecificCourse: function(req, res, next) {
        const courseID = req.params.courseID;
        const query = "SELECT * FROM course WHERE courseID = ? LIMIT 1";
        connection.query(query, [courseID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.courseDetails = result[0];
                next();
            }
        });
    },

    updateCourse: function(req, res, next) {
        const courseID = req.body.courseID;
        const courseName = req.body.courseName;
        const semester = req.body.semester;
        const attendance = req.body.attendance;
        const plannedSeminars = req.body.plannedSeminars;

        const query = "UPDATE course "
                    + "SET courseID = ?, name = ?, semester = ?, attendance = ?, plannedSeminars = ? "
                    + "WHERE courseID = ?";
        connection.query(query, [courseID, courseName, semester, attendance, plannedSeminars, courseID], function(err, result) {
            if(err) {
                next(err);
            } else {
                res.status(200).json("ok");
            }
        });
    },

    deleteCourse: function(req, res, next) {
        const courseID = req.body.courseID;
        const query = "DELETE FROM course WHERE courseID = ?";
        connection.query(query, [courseID], function(err, result) {
            if(err) {
                next(err);
            } else {
                next();
            }
        });
    }

}

module.exports = courseService;