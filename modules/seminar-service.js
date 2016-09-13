var firebase = require("firebase");
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
    console.log("Printing the request before adding viewModel to it: " , req);
    req.viewModel = viewModel;
    console.log("Tries to fetch the values from the snap")
    seminarRef.once('value').then(function(snap){
        req.viewModel.seminars = snap.val();
        console.log("Added data to the view model. Please continue...");
        next();
    });
}

module.exports = seminarService;