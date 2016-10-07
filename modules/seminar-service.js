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
                console.log("Error: " , err);
            } else {
                console.log(result);
                req.seminarGroups = result;
                next();
            }
        });
    },

    /*
    Retrieves all seminar groups
     */
    getAllSeminarGroups: function(req, res, next) {
        const query = "SELECT * FROM seminargroup ORDER BY courseID";
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
    Retrieves all seminar groups for a given course id AND where the user is not signed on. 
    */
    getAllSeminarGroupsFromCourseID: function(req, res, next) {
        const courseID = req.body.courseID;
        console.log(courseID);
        const query = "SELECT * FROM seminargroup WHERE courseID = ? AND `semGrID` NOT IN ("+
            " SELECT `semGrID` FROM `is_in_seminar_group` WHERE `StudID` = ? )"+
            " ORDER BY `seminargroup`.`name` DESC";
        connection.query(query, [courseID, req.session.user.StudID], function(err, result) {
            if(err) {
                next(err);
                console.log(err);
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
        console.log(req.body);
        const courseID = req.body.courseID;
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
            connection.query(query, [courseID, groupName], function(err, result) {
                if(err) {
                    console.log("Error", err);
                    next(err);
                } else {
                    console.log("Result", result);
                    req.queryResult = result;
                    next();
                }
            });
        } else {
            req.statusMessages = statusMessages;
            next();
        }
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
                console.log("There was an error", err);
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

    getSeminarGroupDetails: function(req, res, next) {
        const seminarID = req.params.semGrID;
        const query = "SELECT * FROM seminargroup "
                    + "WHERE semGrID = ?";
        connection.query(query, [seminarID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.seminarGroupDetails = result[0];
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

    }
}

module.exports = seminarService;