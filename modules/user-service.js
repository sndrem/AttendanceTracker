var crypto = require('crypto');
var connection = require("../modules/connection");
var mysql = require('mysql');
var utilities = require("../modules/utilities");
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'atdb',
    charset: 'utf8'
});

var userService = {
    registerUser: function(req, res, next) {
        console.log("Register user");
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var studentID = req.body.studentID;
        var email = req.body.email;
        var password = req.body.password;
        console.log("Password from registration ", password);
        var confirmPassword = req.body.confirmPassword;
        console.log("Confirm password from registration ", confirmPassword);

        if(utilities.isEmpty(firstName)) {
            res.status(400).json("Please provide a first name");
            return;
        }

        if(utilities.isEmpty(studentID)) {
            res.status(400).json("Please provide a student ID");
            return;
        }

        if(utilities.isEmpty(password)) {
            res.status(400).json("Password cannot be empty");
            return;
        }

        if(utilities.isEmpty(confirmPassword)) {
            res.status(400).json("Confirm password cannot be empty");
            return;
        }

        if(utilities.isEmpty(email) || !utilities.isValidEmail(email)) {
            res.status(400).json("Please provide a valid email");
            return;
        }

        if(password !== confirmPassword) {
            res.status(400).json("Your passwords do not match");
            return;
        }


        var salt = crypto.randomBytes(32).toString('hex');
        console.log("Generating random salt ", salt);
        var hashedPassword = crypto.createHash('sha256').update(salt + password, 'utf8').digest('hex');
        console.log("Hashed pwd: ", hashedPassword);
        var values = {
            StudID: studentID,
            fName: firstName,
            lName: lastName,
            eMail: email,
            password: hashedPassword,
            salt: salt
        }

        console.log("Object to be stored in database: " , values);

        var insertQuery = "INSERT INTO person SET ?";
        connection.query(insertQuery, values, function(err, result){
            if(err) {
                console.log(err);
                res.status(400).json(err);
            } else {
                console.log(result);
                req.resultSet = result;
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
        console.log("Passord fra bruker ved login: " + password);

        var getUserQuery = "SELECT * FROM person WHERE eMail = ? LIMIT 1";
        connection.query(getUserQuery, [email], function(err, result){
            if(err) {
                next(err);
            } else if(result.length > 0) {
               // TODO
               // Må sjekke her om passordet som brukeren skriver inn + salt i md5-funksjonen
               // er lik passordet som er lagret i databasen
               var hashedPassword = crypto.createHash('sha256').update(result[0].salt + password, 'utf8').digest('hex');
               console.log("Hashet passord nå: ", hashedPassword);
               console.log("PW fra DB: " , result[0].password);
               if(hashedPassword === result[0].password) {
                console.log("Passord er like");
                req.message = "User found. Should procede to dashboard...";
                req.session.user = result[0];
                next();
               } else {
                res.status(400).json("Username or password is incorrect");
                next();
               }
            } else {
                res.status(400).json("No users found with email: " + email);
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
        const query = "SELECT fName, lName, eMail, StudID FROM PERSON WHERE StudID = ? OR fName like ? OR lName like ?";
        connection.query(query, [studentID, studentID + "%", studentID + "%"], function(err, result) {
            if(err) {
                console.log(err);
                next(err);
            } else {
                if(result.length == 1) {
                    req.resultSet = result[0];
                } else if (result.length > 1) {
                    req.resultSet = result;
                }
                  else {
                    req.resultSet = null;
                }
                next();
            }
        });
    }
};





module.exports = userService;

