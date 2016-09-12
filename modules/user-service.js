var firebase = require("firebase");
var async = require("async");
var seminarService = require("../modules/seminar-service");
var userService = {};

userService.getNames = function(req, res, next){
    var keys = Object.keys(req.seminarStudents);
    var userRef = firebase.database().ref("users");
    req.studentNames = [];
    async.eachOf(keys, function(value, key, callback){
        console.log("Nøkkel: " + key);
        console.log("Verdi: " + value);
         userRef.child(value).child('name').once('value', function(snapshot){
            req.studentNames.push(snapshot.val());
            console.log(snapshot.val());

        });
    }, function(error) {
        next();
    });
}



module.exports = userService;

