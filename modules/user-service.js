var md5 = require('md5');
var connection = require("../modules/connection");
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'atdb'
});

var userService = {
    registerUser: function(req, res, next) {
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var studentID = req.body.studentID;
        var email = req.body.email;
        var password = req.body.email;
        var confirmPassword = req.body.confirmPassword;
        var salt = "85478tug9efunc78ryw378e983wud";
        // TODO - Sjekke email og passord

        var values = {
            StudID: studentID,
            fName: firstName,
            lName: lastName,
            eMail: email,
            password: md5(password + salt),
            salt: salt
        }

        var insertQuery = "INSERT INTO person SET ?";
        console.log("Tries to insert new person");
        connection.query(insertQuery, values, function(err, result){
            if(err) {
                res.message = err;
                next();
            } else {
                console.log("Success. Should redirect to dashboard");
                next();
            }
        });

    }
};





module.exports = userService;

