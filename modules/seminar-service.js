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
    var seminarRef = firebase.database().ref("seminars");
    var viewModel = {
        user: req.user.email,
        seminars: [],
        title: "Velkommen"
    };
    req.viewModel = viewModel;

    seminarRef.once('value').then(function(snap){
        req.viewModel.seminars = snap.val();
        next();
    });
}

module.exports = seminarService;