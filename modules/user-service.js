var md5 = require('md5');
var connection = require("../modules/connection");
var mysql = require('mysql');
var salt = "85478tug9efunc78ryw378e983wud";
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
        // TODO - Sjekke email og passord

        password = md5(password.trim() + salt.trim());
        console.log("Generating password " , password);
        var values = {
            StudID: studentID,
            fName: firstName,
            lName: lastName,
            eMail: email,
            password: password,
            salt: salt
        }

        var insertQuery = "INSERT INTO person SET ?";
        console.log("Tries to insert new person");
        connection.query(insertQuery, values, function(err, result){
            if(err) {
                res.message = err;
                next();
            } else {
                res.message = "User created";
                next();
            }
        });
    },

    authenticate: function(req, res, next) {
        var email = req.body.email;
        var password = req.body.password;

        var getUserQuery = "SELECT eMail, password, salt FROM person WHERE eMail = ? LIMIT 1";
        connection.query(getUserQuery, [email], function(err, result){
            if(err) {
                console.log("Error: ", err);
                next(err);
            } else if(result.length > 0) {
               // TODO
               // Må sjekke her om passordet som brukeren skriver inn + salt i md5-funksjonen
               // er lik passordet som er lagret i databasen
               req.message = "User found. Should procede to dashboard...";
               next();
            } else {
                console.log("No users found with email: " + email);
                req.message = "No users found with email: " + email;
                next();
            }
        });
    }
};





module.exports = userService;

