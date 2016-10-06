var md5 = require('md5');
var crypto = require('crypto');
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
        // TODO - Sjekke email og passord
        var salt = crypto.randomBytes(16).toString('hex');
        var hashedPassword = crypto.createHash('md5').update(salt + password, 'utf8').digest('hex');
        var values = {
            StudID: studentID,
            fName: firstName,
            lName: lastName,
            eMail: email,
            password: hashedPassword,
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

    // Adds a user to the admin table as an assistant
    registerUserAsAssistant: function(req, res, next) {
        console.log(req.body);
        const adminID = req.body.studentID;
        const adminType = req.body.adminType;
        var query = "INSERT INTO admins (id, adminType) VALUES (?, ?)";
        connection.query(query, [adminID, adminType], function(err, result) {
            if(err) {
                console.log(err);
                req.message = "User with ID: " + adminID + " is already an assistant";
                next();
            } else {
                console.log(result);
                req.message = "User with ID: " + adminID + " is now an assistant";
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
               var hashedPassword = crypto.createHash('md5').update(result[0].salt + password, 'utf8').digest('hex');
               console.log("Hashet passord nå: ", hashedPassword);
               console.log("PW fra DB: " , result[0].password);
               if(hashedPassword === result[0].password) {
                console.log("Passord er like");
               } else {
                console.log("Passord er ikke like");
               }
                req.message = "User found. Should procede to dashboard...";
                req.session.user = result[0];
                next();
            } else {
                req.message = "No users found with email: " + email;
                next();
            }
        });
    },

    checkAdminStatus: function(req, res, next) {
        const studID = req.session.user.StudID;
        const query = "SELECT adminType FROM admins "
                    + "WHERE id = ?";
        connection.query(query, [studID], function(err, result) {
            if(err) {
                console.log("Error", err);
                next(err);
            } else {
                // If no results, we know that the user is not 
                // an admin
                if(result.length == 0) {
                    req.session.user.adminType = null;
                    req.redirect_url = '/student/dashboard';
                } else {
                    // If result, we know store the type of admin for the user
                    req.session.user.adminType = result[0].adminType;
                    const adminType = req.session.user.adminType;
                    if(adminType === 'assistent') {
                        req.redirect_url = '/assistant/dashboard';
                    } else if(adminType === 'master') {
                        console.log("We found a master");
                        req.redirect_url = '/admin/dashboard';
                    }
                }
                next();
            }
        });
    },

    isAdmin: function(req, res, next) {
        if(req.session && req.session.user) {
            if(req.session.user.adminType === 'master') {
                next();
            } else {
                res.redirect("/");
            }
        }
    },

    isAssistant: function(req, res, next) {
        if(req.session && req.session.user) {
            if(req.session.user.adminType === 'assistent') {
                next();
            } else {
                res.redirect("/");
            }
        }
    },

    isAdminOrAssistant: function(req, res, next) {
        if(req.session && req.session.user) {
            if(req.session.user.adminType === 'master' || req.session.user.adminType === 'assistent') {
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
    },

    checkExistingUser: function(req, res, next) {
        const studentID = req.body.studentID;
        const query = "SELECT fName, lName, eMail FROM PERSON WHERE StudID = ? LIMIT 1";
        connection.query(query, [studentID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.resultSet = result[0];
                next();
            }
        });
    }
};





module.exports = userService;

