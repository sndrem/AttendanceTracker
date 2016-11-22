var crypto = require('crypto');
var connection = require("../modules/connection");
var utilities = require("../modules/utilities");

var userService = {
    registerUser: function(req, res, next) {
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var studentID = req.body.studentID;
        var email = req.body.email;
        var password = req.body.password;
        var confirmPassword = req.body.confirmPassword;

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
        var hashedPassword = crypto.createHash('sha256').update(salt + password, 'utf8').digest('hex');
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
                res.status(400).json(err);
            } else {
                req.resultSet = result;
                next();
            }
        });
    },

    updateUserProfile: function(req, res, next) {
        var user = JSON.parse(req.body.user);
        const firstName = user.firstName;
        const lastName = user.lastName;
        const email = user.email;
        const userID = req.session.user.StudID;

        const query = "UPDATE person SET fName = ?, lName = ?, eMail = ? WHERE StudID = ?";
        connection.query(query, [firstName, lastName, email, userID], function(err, result) {
            if(err) {
                next(err);
            } else {
                req.resultSet = result;
                req.session.user.eMail = email;
                next();
            }
        });
    },

    // Adds a user to the admin table as an assistant
    registerUserAsAssistant: function(req, res, next) {
        const adminID = req.body.studentID;
        const adminType = req.body.adminType;
        var query = "INSERT INTO admins (id, adminType) VALUES (?, ?)";
        connection.query(query, [adminID, adminType], function(err, result) {
            if(err) {
                req.message = "User with ID: " + adminID + " is already an assistant";
                next();
            } else {
                req.message = "User with ID: " + adminID + " is now an assistant";
                next();
            }
        });
    },

    // Connects an assistant to a course
    registerAssistantToCourse: function(req, res, next) {
        const assistantID = req.body.studentAssistant;
        const courseID = req.body.courseSelection;
        const query = "INSERT INTO is_assistant_for VALUES(?, ?)";
        if(assistantID.length > 0 || courseID.length > 0) {
            connection.query(query, [assistantID, courseID], function(err, result) {
                if(err) {
                    next(err);
                } else {
                    req.resultSet = result;
                    next();
                }
            });
        } else {
            res.status(400).json({'message': 'Assistant and/or course cannot be empty'});
        }
    },

    authenticate: function(req, res, next) {
        console.log("Trying to authenticate", req.body);
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
               var hashedPassword = crypto.createHash('sha256').update(result[0].salt + password, 'utf8').digest('hex');
               if(hashedPassword === result[0].password) {
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
                next(err);
            } else {
                // If no results, we know that the user is not
                // an admin
                if(result.length == 0) {
                    req.session.user.adminType = null;
                    req.redirect_url = '/student/dashboard';
                } else {
                    // If result, we now store the type of admin for the user
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
    },

    getAllAssistants: function(req, res, next) {
        const query = "SELECT fName, lName, StudID "
                    + "FROM person "
                    + "JOIN admins "
                    + "ON person.`StudID` = admins.`id` "
                    + "WHERE adminType = 'assistent' ";
        connection.query(query, function(err, result) {
            if(err) {
                next(err);
            } else {
                req.assistants = result;
                next();
            }
        });
    }
};





module.exports = userService;

