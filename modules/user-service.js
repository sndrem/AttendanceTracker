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
        var values = {
            StudID: studentID,
            fName: firstName,
            lName: lastName,
            eMail: email,
            password: password,
            salt: salt
        }

        var insertQuery = "INSERT INTO person SET ?";
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

        var getUserQuery = "SELECT * FROM person WHERE eMail = ? LIMIT 1";
        connection.query(getUserQuery, [email], function(err, result){
            if(err) {
                next(err);
            } else if(result.length > 0) {
               // TODO
               // Må sjekke her om passordet som brukeren skriver inn + salt i md5-funksjonen
               // er lik passordet som er lagret i databasen
                req.message = "User found. Should procede to dashboard...";
                req.session.user = result[0];
                next();
            } else {
                req.message = "No users found with email: " + email;
                next();
            }
        });
    },

    isAdmin: function(req, res, next) {
        const studID = req.session.user.StudID;
        const query = "SELECT adminType FROM admins "
                    + "WHERE id = ?";
        connection.query(query, [studID], function(err, result) {
            if(err) {
                next(err);
            } else {
                // If no results, we know that the user is not 
                // an admin
                if(result.length == 0) {
                    req.session.user.adminType = null;
                } else {
                    // If result, we know store the type of admin for the user
                    req.session.user.adminType = result[0].adminType;    
                }
                next();
            }
        });
    },

    isAssistant: function(req, res, next) {
        if(req.session && req.session.user) {
            if(req.session.user.adminType === 'assistant') {
                next();
            } else {
                res.redirect("/");
            }
        }
    },

    requireLogin: function(req, res, next) {
        if(!req.user) {
            res.redirect("/login");
        } else {
            next();
        }
    },

    getUser: function(email, callback) {
        var getUserQuery = "SELECT * FROM person WHERE eMail = ?";
        connection.query(getUserQuery, [email], function(err, result) {
            if(result.length == 0) {
                callback({
                    error: 'Could not find user'
                }, []);
            } else {
                callback(err, result);
            }
            
        });
    }
};





module.exports = userService;

