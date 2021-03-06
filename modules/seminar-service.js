var moment = require('moment');
var userService = require("../modules/user-service")
var salt = "85478tug9efunc78ryw378e983wud";
var connection = require('../modules/connection');

var seminarService = {

    /*
    Retrieves all seminargroups for a student
     */
    getUserSeminarGroups: function(req, res, next) {

        var userSeminarGroupQuery =  "SELECT seminargroup.`semGrID`, seminargroup.`courseID`, seminargroup.`name` "
                                +    "FROM seminargroup "
                                +    "JOIN `is_in_seminar_group`  "
                                +    "on `is_in_seminar_group`.`semGrID` = seminargroup.`semGrID` "
                                +    "JOIN person "
                                +    "ON `is_in_seminar_group`.`StudID` = person.`StudID`"
                                +    "WHERE person.`StudID` = ?";
        connection.query(userSeminarGroupQuery, [req.session.user.StudID], function(err, result) {
            if(err) {
            } else {
                req.seminarGroups = result;
                next();
            }
        });
    },

    // Retrieves all seminar groups for a given course
    getSeminarGroupsForCourse: function(req, res, next) {
        const courseID = req.params.courseID;
        const query = "SELECT * FROM seminargroup "
                    + "WHERE courseID = ?";
        connection.query(query, [courseID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.seminarGroups = result;
                next();
            }
        });
    },

    // Retrieves all the course names and course id's for the logged in user that they are a member of
    getUserCourses: function(req, res, next) {
        const userID = req.session.user.StudID;
        const query = "SELECT DISTINCT course.`name`, course.`courseID` FROM course "
                    + "JOIN seminargroup "
                    + "ON seminargroup.`courseID` = course.`courseID` "
                    + "JOIN `is_in_seminar_group` "
                    + "ON seminargroup.`semGrID` = `is_in_seminar_group`.`semGrID` "
                    + "WHERE `is_in_seminar_group`.`StudID` = ?";
        connection.query(query, [userID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.userCourses = result;
                next();
            }
        });
    },

    getUserSeminarGroups: function(req, res, next) {
        const StudID = req.session.user.StudID;
        const query = "SELECT StudID, seminargroup.semGrID, courseID, name "
                    + "FROM `is_in_seminar_group` "
                    + "JOIN `seminargroup` "
                    + "ON `is_in_seminar_group`.`semGrID` = seminargroup.`semGrID`  "
                    + "WHERE `is_in_seminar_group`.`StudID` = ? ";
        connection.query(query, [StudID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.userSeminarGroups = result;
                next();
            }
        });
    },

    /*
    Retrieves all seminar groups
     */
    getAllSeminarGroups: function(req, res, next) {
        const query = "SELECT * FROM seminargroup ORDER BY courseID, name";
        connection.query(query, function(err, result) {
            if(err) {
                next(err);
            } else {
                req.seminarGroups = result;
                next();
            }
        });
    },

    /*
    Deletes a seminar group based on the id
    */
    deleteSeminarGroup: function(req, res, next) {
        const seminarGroupID = req.params.semGrID;
        const query = "DELETE FROM seminargroup WHERE semGrID = ?";
        connection.query(query, [seminarGroupID], function(err, result) {
            if(err) {
                next(err);
            } else {
                next();
            }
        });
    },

    /*
    Retrieves all seminar groups for a given course id AND where the user is not signed on. 
    */
    getAllSeminarGroupsFromCourseIDExcludingUserID: function(req, res, next) {
        const courseID = req.body.courseID;
        const query = "SELECT * FROM seminargroup WHERE courseID = ? AND `semGrID` NOT IN ("+
            " SELECT `semGrID` FROM `is_in_seminar_group` WHERE `StudID` = ? )"+
            " ORDER BY `seminargroup`.`name` DESC";
        connection.query(query, [courseID, req.session.user.StudID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.resultSet = result;
                next();
            }
        });
    },

    /*
    Creates a new seminar group
     */
    createSeminarGroup: function(req, res, next) {
        const courseID = req.body.courseID.toUpperCase();
        const groupName = req.body.groupName;
        const query = "INSERT INTO seminargroup (courseID, name) "
                    + "VALUES (?, ?);";

        var statusMessages = [];
        if(courseID === '') {
            statusMessages.push("Course ID cannot be empty");
        }

        if(groupName === '') {
            statusMessages.push("Group name cannot be empty");
        }

        if(statusMessages.length == 0) {
            //kjører query2 som sjekker om det finnes en gruppe med likt navn og courseID
            connection.query(query, [courseID, groupName], function(err, result) {
                if(err) {
                    next(err);
                } else {
                    req.queryResult = result;
                    res.status(200).json(groupName + " was created");
                }
            });
        } else {
            req.statusMessages = statusMessages;
            next();
        }
    },

    checkIfGroupExists: function(req,res,next){
        const courseID = req.body.courseID;
        const groupName = req.body.groupName;
        const query = "SELECT * FROM seminargroup WHERE name = ? AND courseID = ?";
        connection.query(query, [groupName, courseID],function(err,result){
                if(err){
                    next(err);
                }else{
                    if(result.length == 0){
                        next();
                    }else{
                        res.status(200).json("The group already exists");
                    }     
                }
        });
    },   

    /*
    Retrieves all courses
     */
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

    /*
    Adds a user to a seminar
     */
    addUserToSeminar: function(req, res, next) {
        const seminarID = req.params.semGrID;
        const userID = req.user.StudID;
        const values = {
            StudID: userID,
            semGrID: seminarID
        }
        const query = "INSERT INTO is_in_seminar_group SET ?";
        connection.query(query, values, function(err, result) {
            if(err) {
                next(err);
            } else {
                req.seminarAdded = result;
                next();
            }
        });
    },

    /*
    Adds a user to the enrolled_in table
    */
    addUserToCourse: function(req, res, next) {
        const courseID = req.body.courseID;
        const userID = req.session.user.StudID;
        var values = {
            StudID: userID,
            courseID: courseID
        }
        const query = "INSERT INTO enrolled_in SET ?";
        connection.query(query, values, function(err, result) {
            if(err) {
                next();
            } else {

                req.resultSet = result;
                next();
            }
        })
    },

    /*
    Removes a user from a seminar
     */
    removeUserFromSeminar: function(req, res, next) {
        const seminarID = req.params.semGrID;
        const userID = req.user.StudID;
        const query = 'DELETE FROM is_in_seminar_group '
                    + 'WHERE StudID = ? AND semGrID = ?';
        connection.query(query, [userID, seminarID], function(err, result) {
            if(err) {
                next(err);
            } else {
                next();
            }
        });
    },

    setSeminarAssistant: function(req, res, next){
        const userID = req.params.StudID;
        const courseID = req.params.courseID;
        const values = {
            StudID: userID,
            courseID: courseID
        }

        const query = "INSERT INTO is_assistant_for SET ?";

        connection.query(query, values, function(err, result) {
            if(err){
                next(err);
            }else{
                req.setSeminarAssistant = result;
                next();
            }
        });
    },

    getAllAttendanceForCourseForStudent: function(req, res, next) {
        const userID = req.session.user.StudID;
        const courseID = req.params.courseID;
        const query = "SELECT seminargroup.`name`, seminar.`semID`, seminar.`date`, seminar.`semGrID`, seminar.`place`, seminar.`oblig`, seminar.`duration`, seminar.`cancelled`, `attends_seminar`.`attended` FROM seminar "
                    + "JOIN `attends_seminar` "
                    + "ON seminar.`semID` = `attends_seminar`.`semID` "
                    + "JOIN `person` "
                    + "ON person.`StudID` = `attends_seminar`.`StudID` "
                    + "JOIN seminargroup  "
                    + "ON seminargroup.`semGrID` = seminar.`semGrID` "
                    + "WHERE `person`.`StudID`= ? AND seminargroup.`courseID` = ? "
                    + "ORDER BY seminar.`date` desc ";
        connection.query(query, [userID, courseID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.studentAttendance = result;
                next();
            }
        });
    },

    getSeminarDetails: function(req, res, next) {
        const seminarID = req.params.semGrID;
        const userID = req.user.StudID;
        const query =   'SELECT seminargroup.`name`, seminar.`semID`, seminar.`date`, seminar.`semGrID`, seminar.`place`, seminar.`oblig`, seminar.`duration`, seminar.`cancelled`, `attends_seminar`.`attended` FROM seminar '
                    +   'JOIN `attends_seminar` '
                    +   'ON seminar.`semID` = `attends_seminar`.`semID`'
                    +   'JOIN `person`'
                    +   'ON person.`StudID` = `attends_seminar`.`StudID` AND seminar.`semGrID` = ? '
                    +   'JOIN seminargroup '
                    +   'ON seminargroup.`semGrID` = seminar.`semGrID` '
                    +   'WHERE `person`.`StudID`= ?'
                    +   'ORDER BY seminar.`date`';
        connection.query(query, [seminarID, userID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.seminarDetails = result;
                next();
            }
        });
    },

    getCourseDetails: function(req, res, next) {
        const courseID = req.params.courseID;
        const query = "SELECT * FROM course "
                    + "WHERE courseID = ?";
        connection.query(query, [courseID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.courseDetails = result[0];
                next();
            }
        });
    },

    getNumberOfSeminarsForStudent: function(req, res, next) {
        const userID = req.user.StudID;
        const seminarID = req.params.semGrID;
        const query =   " SELECT count(`attends_seminar`.`StudID`) as numOfSeminars "
                      + " FROM `attends_seminar` "
                      + " JOIN seminar "
                      + " ON `attends_seminar`.`semID` = seminar.`semID` "
                      + " JOIN seminargroup "
                      + " ON seminar.`semGrID` = seminargroup.`semGrID` "
                      + " WHERE `attends_seminar`.`StudID` = ? AND seminargroup.`semGrID` = ?";
        connection.query(query, [userID, seminarID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.seminarDetails.numOfSeminars = result[0].numOfSeminars;
                next();
            }
        })
    },

    getAllStudentsFromGroup: function(req, res, next) {
        const semGrID = req.params.semGrID;
        const query = "SELECT person.StudID, CONCAT(fName, ' ', lName) as fullName, semGrID from person "
                    + "JOIN `is_in_seminar_group` "
                    + "ON person.`StudID` = `is_in_seminar_group`.`StudID` "
                    + "WHERE `is_in_seminar_group`.`semGrID` = ?";
        connection.query(query, [semGrID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.semGroupsStudents = result;
                next();
            }
        });
    },

    getAllAttendanceInfoForStudentsFromGroups: function(req, res, next) {
        const semGrID = req.params.semGrID;
        const query = "SELECT person.StudID, concat(fName, ' ', lName) as fullName, count(attended) as totalAttendance, count(case attended when 1 then 1 else null END) as met, count(case attended when 1 then null else 1 END) as away, eMail as email "
                    + "FROM person "
                    + "JOIN `attends_seminar` "
                    + "ON person.`StudID` = `attends_seminar`.`StudID` "
                    + "JOIN seminar "
                    + "ON `attends_seminar`.`semID` = seminar.`semID` "
                    + "JOIN seminargroup "
                    + "ON seminar.`semGrID` = seminargroup.`semGrID` "
                    + "where seminargroup.`semGrID` =  ? "
                    + "group by fullName, person.StudID, person.eMail ";
        connection.query(query, [semGrID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.semGroupsStudents = result;
                next();
            }
        });
    },

    getAbsenceOfSeminarForStudent: function(req, res, next) {
        const userID = req.user.StudID;
        const seminarID = req.params.semGrID;
        const courseID = req.params.courseID;
        const query = "SELECT SUM(`seminar`.`duration`)/60 as sumAbsence "
                    + "FROM `attends_seminar` " 
                    + "JOIN seminar ON `attends_seminar`.`semID` = seminar.`semID` " 
                    + "JOIN seminargroup ON seminar.`semGrID` = seminargroup.`semGrID` "
                    + "JOIN course ON seminargroup.`courseID` = course.`courseID`" 
                    + "WHERE `attends_seminar`.`StudID` = ? AND seminargroup.`courseID` = ? AND `attends_seminar`.`attended` = 0 ";
        connection.query(query, [userID, courseID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.numOfAbsence = result[0];
                next();
            }
        });
    },

    getStudentAttendanceForCourse: function(req, res, next) {
        const userID = req.user.StudID;
        const courseID = req.params.courseID;
        const semGrID = req.params.semGrID;
        const query = "SELECT "
                    + "(SELECT COUNT(`attends_seminar`.`attended`) " 
                    + "FROM `attends_seminar` "
                    + "JOIN seminar ON `attends_seminar`.`semID` = seminar.`semID` "
                    + "JOIN seminargroup ON seminar.`semGrID` = seminargroup.`semGrID` "
                    + "JOIN course ON seminargroup.`courseID` = course.`courseID`"
                    + "WHERE `attends_seminar`.`StudID` = ? AND seminar.`semGrID` = seminargroup.`semGrID` AND seminargroup.`courseID` = ? AND `attends_seminar`.`attended` = 1)/ "
                    + "(SELECT DISTINCT `course`.`plannedSeminars` "
                    + "FROM course "
                    + "WHERE course.`courseID` = ?) * 100 "
                    + "as totalAttendance";
        connection.query(query, [userID, courseID, courseID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.numOfAttendance = result[0];
                next();
            }
        });
    },

    getTotalMinutesOfPlannedSeminars: function(req, res, next) {
        const userID = req.user.StudID;
        const seminarID = req.params.semGrID;
        const courseID = req.params.courseID;
        const query = "SELECT "
                    + "(SELECT DISTINCT `seminar`.`duration` " 
                    + "FROM `attends_seminar` "
                    + "JOIN seminar ON `attends_seminar`.`semID` = seminar.`semID` "
                    + "JOIN seminargroup ON seminar.`semGrID` = seminargroup.`semGrID` "
                    + "JOIN course ON seminargroup.`courseID` = course.`courseID` "
                    + "WHERE `attends_seminar`.`StudID` = ? AND seminargroup.`courseID` = ? LIMIT 1)* "
                    + "(SELECT DISTINCT `course`.`plannedSeminars` "
                    + "FROM `attends_seminar` "
                    + "JOIN seminar ON `attends_seminar`.`semID` = seminar.`semID` "
                    + "JOIN seminargroup ON seminar.`semGrID` = seminargroup.`semGrID` "
                    + "JOIN course ON seminargroup.`courseID` = course.`courseID` "
                    + "WHERE `attends_seminar`.`StudID` = ?) * "
                    + "(SELECT DISTINCT (100-`course`.`attendance`)/100 "
                    + "FROM `attends_seminar` "
                    + "JOIN seminar ON `attends_seminar`.`semID` = seminar.`semID` "
                    + "JOIN seminargroup ON seminar.`semGrID` = seminargroup.`semGrID` "
                    + "JOIN course ON seminargroup.`courseID` = course.`courseID` "
                    + "WHERE `attends_seminar`.`StudID` = ?)"
                    + "/60 "
                    + "as totalPlanned";
        connection.query(query, [userID, courseID, userID, userID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.totalPlanned = result[0];
                next();
            }
        });
    },

    registerAttendanceForGroup: function(req, res, next) {
        var students = JSON.parse(req.body.students);
        var studentList = [];
        if(students.length == 0) {
            next();
        } else if(students.length > 0) {
            students.forEach(function(student){
                studentList.push([student.StudID, req.seminarInsertId, student.attended]);
            });
            const query = "INSERT INTO attends_seminar (StudID, semID, attended) VALUES ?";
            connection.query(query, [studentList], function(err, data) {
                if(err) {
                    next(err);
                } else {
                    next();
                }
            });
        }
    },

    // Used when creating a new row in the seminar-table in our database
    createSeminar: function(req, res, next) {
        const semGrID = req.body.semGrID;
        const place = req.body.place;
        const date = moment().format("YYYY-MM-DD HH:mm:ss");
        const status = req.body.status;

        const query = "INSERT INTO seminar (semGrID, oblig, place, date, duration, cancelled) "
                    + "VALUES(?, ?, ?, ?, ?, ?)";
        connection.query(query, [semGrID, 1, place, date, 120, status], function(err, data) {
            if(err) {
                next(err);
            } else {
                req.seminarInsertId = data.insertId;
                next();
            }
        });
    },

    updateSeminar: function(req, res, next) {
        const semGrID = req.body.semGrID;
        const place = req.body.place;
        const updateID = req.body.updateID;
        // Sjekk date-greien her: http://stackoverflow.com/questions/5129624/convert-js-date-time-to-mysql-datetime/11150727#11150727
        // Den gir noe feil tid, lol
        // const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
        const status = req.body.status;

        const query = "UPDATE seminar SET place = ?, cancelled = ? "
                    + "WHERE semID = ?";
        connection.query(query, [place, status, updateID], function(err, data) {
            if(err) {
                next(err);
            } else {
                req.resultSet = data;
                next();
            }
        });
    },

    updateAttendanceForGroup: function(req, res, next) {
        var students = JSON.parse(req.body.students);
        const updateID = req.body.updateID;
        var studentList = [];
        var queries = '';
        if(students.length == 0) {
            next();
        } else if(students.length > 0) {
            students.forEach(function(student){
                queries += mysql.format("UPDATE attends_seminar SET StudID = ?, semID = ?, attended = ? WHERE semID = ? AND StudID = ? ; ", [student.StudID, updateID, student.attended, updateID, student.StudID]);
                studentList.push([student.StudID, updateID, student.attended]);
            });
            connection.query(queries, function(err, data) {
                if(err) {
                    next(err);
                } else {
                    next();
                }
            });
        }
    },

    getPreviousSeminars: function(req, res, next) {
        const semGrID = req.params.semGrID;
        const query = "SELECT DISTINCT semID, place, date, semGrID FROM seminar "
                    + "WHERE semGrID = ? "
                    + "ORDER BY date DESC";
        connection.query(query, [semGrID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.previousSeminars = result;
                next();
            }
        });
    },

    getPreviousAttendance: function(req, res, next) {
        const prevId = req.params.prevSemId;
        const query = "SELECT person.`StudID`, CONCAT(person.fName, ' ', person.lName) as fullName, attended, seminar.cancelled, attends_seminar.semID, date "
                    + "FROM person "
                    + "JOIN `attends_seminar` "
                    + "ON person.`StudID` = `attends_seminar`.`StudID` "
                    + "JOIN seminar "
                    + "ON `attends_seminar`.semID = seminar.`semID` "
                    + "WHERE `attends_seminar`.`semID` = ? "
        connection.query(query, [prevId], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.previousAttendance = result;
                next();
            }
        });
    },

    getPlaceOfSeminar: function(req, res, next) {
        const semID = req.params.prevSemId;
        const query = "SELECT place FROM seminar WHERE semID = ?";
        connection.query(query, [semID], function(err, result) {
            if(err) {
                next(err);
            } else {
                if(result.length > 0) {
                    req.seminarPlace = result[0].place;
                } else {
                    req.seminarPlace = "Unknown location";
                }
                next();
            }
        });
    },

    getLocations: function(req, res, next) {
        const query = "SELECT roomCode, roomName FROM locations";
        connection.query(query, function(err, result) {
            if(err) {
                next(err);
            } else {
                req.locations = result;
                next();
            }
        });
    },

    getTotalSeminarsForSeminarGroup: function(req, res, next) {
        const semGrID = req.params.semGrID;
        const query = "SELECT count(`semGrID`) as totalSeminars "
                    + "FROM seminar "
                    + "WHERE semGrID = ?";
        connection.query(query, [semGrID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.totalSeminars = result[0].totalSeminars;
                next();
            }
        }); 
    },

    getStudentAttendanceInfo: function(req, res, next) {
        const userID = req.body.StudID;
        const semGrID = req.body.semGrID;
        const query = "SELECT seminargroup.`name`, seminar.`semID`, seminar.`date`, seminar.`semGrID`, seminar.`place`, seminar.`oblig`, seminar.`duration`, seminar.`cancelled`, `attends_seminar`.`attended` FROM seminar "
                    + "JOIN `attends_seminar` "
                    + "ON seminar.`semID` = `attends_seminar`.`semID` "
                    + "JOIN `person` "
                    + "ON person.`StudID` = `attends_seminar`.`StudID` "
                    + "JOIN seminargroup  "
                    + "ON seminargroup.`semGrID` = seminar.`semGrID` "
                    + "WHERE `person`.`StudID`= ? AND seminar.`semGrID` = ?"
                    + "ORDER BY seminar.`date` desc"
        connection.query(query, [userID, semGrID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.studentAttendance = result;
                next();
            }
        });
    },

    deleteSeminar: function(req, res, next) {
        const semID = req.body.seminarID;
        const seminarGroupID = req.body.semGrID;
        const query = "DELETE from seminar WHERE semID = ? AND semGrID = ?";
        connection.query(query, [semID, seminarGroupID], function(err, result) {
            if(err) {
                next(err);
            } else {
                next();
            }
        }); 

        next();
    }
}

module.exports = seminarService;