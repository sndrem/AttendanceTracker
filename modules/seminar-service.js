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

    getUserSeminarGroups: function(req, res, next) {

        console.log("Fetching all user seminar groups for user with id: ", req.session.user.StudID);

        var userSeminarGroupQuery =   "SELECT seminargroup.`semGrID`, seminargroup.`courseID`, seminargroup.`name` "
                                + "FROM seminargroup "
                                + "JOIN `is_in_seminar_group`  "
                                + "ON `is_in_seminar_group`.`semGrID` = seminargroup.`semGrID` "
                                + "JOIN person "
                                + "ON `is_in_seminar_group`.`StudID` = ?"; 
        connection.query(userSeminarGroupQuery, [req.session.user.StudID], function(err, result) {
            if(err) {
                console.log("Error: " , err);
            } else {
                req.seminarGroups = result;
                next();
            }
        });
    },

    getAllSeminarGroups: function(req, res, next) {
        const query = "SELECT * FROM seminargroup";
        connection.query(query, function(err, result) {
            if(err) {
                next(err);
            } else {
                req.seminarGroups = result;
            }
        });
    }
}

module.exports = seminarService;