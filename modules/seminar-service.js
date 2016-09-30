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
        const query = "SELECT * FROM seminargroup";
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

    getSeminarDetails: function(req, res, next) {
        const seminarID = req.params.semGrID;
        const userID = req.user.StudID;
        const query =   'SELECT seminargroup.`name`, seminar.`semID`, seminar.`date`, seminar.`semGrID`, seminar.`place`, seminar.`oblig`, seminar.`duration`, seminar.`cancelled`, `attends_seminar`.`attended` FROM seminar '
                    +   'JOIN `attends_seminar` '
                    +   'ON seminar.`semID` = `attends_seminar`.`semID`'
                    +   'JOIN `person`'
                    +   'ON person.`StudID` = ? AND seminar.`semGrID` = ? '
                    +   'JOIN seminargroup '
                    +   'ON seminargroup.`semGrID` = seminar.`semGrID` '
                    +   'ORDER BY seminar.`date`';
        connection.query(query, [userID, seminarID], function(err, result) {
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