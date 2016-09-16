var firebase = require("firebase");
var async = require("async");
var userService = require("../modules/user-service")
var seminarService = {};

seminarService.getSeminarStudents = function(req, res, next) {
    var seminarKey = req.params.seminarKey;
    var courseKey = req.params.courseKey;

    var studentRef = firebase.database().ref("seminars").child(courseKey).child(seminarKey).child("students");
    studentRef.once('value').then(function(snapshot) {
        req.seminarStudents = snapshot.val();
        next();
    });
}

seminarService.addStudentToSeminar = function(req, res, next) {
    console.log("Should add student" + req.user.email + " to seminar");
    var user = req.user.email;
    var userUID = req.user.uid;
    var courseID = req.params.courseID;
    var seminarID = req.params.seminarID;
    var seminarRef = firebase.database().ref("seminars").child(courseID).child(seminarID).child("students");
    seminarRef.child(userUID).set({
        attends: true
    });

    var groupRef = firebase.database().ref("users").child(userUID).child("groups");
    var payload = {};
    payload[courseID] = seminarID;
    groupRef.push(payload);
    next();
}

seminarService.getSeminars = function(req, res, next) {
    console.log("Getting reference to seminars");
    var seminarRef = firebase.database().ref("seminars");
    console.log("Creating the view model object");
    console.log("Printing some motherfucking text");
    var viewModel = {
        user: req.user.email,
        seminars: [],
        title: "Velkommen"
    };
    // console.log("Printing the request before adding viewModel to it: " , req);
    req.viewModel = viewModel;
    console.log("Tries to fetch the values from the snap")
    seminarRef.once('value').then(function(snap){
        req.viewModel.seminars = snap.val();
        console.log("Added data to the view model. Please continue...");
        next();
    });
}

seminarService.getUserSeminars = function(req, res, next) {
    var userSeminarRef = firebase.database().ref("users");
    var user = req.user.uid;
    userSeminarRef.child(user).child('groups').once('value', function(snapshot){
        req.userSeminars = snapshot.val();
        next();
    });
}

seminarService.getUserSeminarDetails = function(req, res, next) {
    var ref = firebase.database().ref("seminars");
    var userSeminars = req.userSeminars;
    var key = Obje
    console.log(userSeminars);
    req.userSeminars = [];

    // async.eachOf(userSeminars, function(value, key, callback){
    //         console.log("Value: ", value);
    //         var courseKey = Object.keys(value)[0];
    //         console.log("Kursnøkkel: " , courseKey);
    //         console.log("Key: ", key);
    //         ref.child(key).child(courseKey).once('value', function(snapshot){
    //             console.log(snapshot.val());
    //             req.userSeminars.push(snapshot.val());
    //             callback();
    //         });
            
    // }, function(error){
    //     next();
    // });
}

module.exports = seminarService;