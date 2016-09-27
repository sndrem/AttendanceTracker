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

    getAllSeminarGroups: function(req, res, next) {

        var allSeminarQuery = "SELECT * FROM seminargroup";
        connection.query(allSeminarQuery, function(err, result) {
            if(err) {
                console.log("Error: " , err);
            } else {
                req.seminarGroups = result;
                next();
            }
        });
    }
}

module.exports = seminarService;