var firebase = require("firebase");
var async = require("async");
var seminarService = require("../modules/seminar-service");
var userService = {};

userService.getNames = function(req, res, next){
    
    // If there are noe seminarStudents, we simply render a page with a message
    if(req.seminarStudents == null) {
        res.render("noStudents", {message: "No students assigned to this course"});
    }
    // Get the keys (uid's) of the seminarStudents
    var keys = Object.keys(req.seminarStudents);
    // Create a reference to the user node in Firebase
    var userRef = firebase.database().ref("users");
    // Attach an array on the request object for storing the student names
    req.studentNames = [];
    // Here we use the async-library to help is with the asynchronous hell
    // We loop through each key, then gets the name in the database
    async.eachOf(keys, function(value, key, callback){
         userRef.child(value).child('name').once('value', function(snapshot){
            // Her pusher vi hver verdi (altså navnene) til arrayet for å holde
            // på studentnavnene
            req.studentNames.push(snapshot.val());
            // Så skriver vi ut til konsollen fordi vi ikke aner hva vi egentlig driver med
            console.log(snapshot.val());
            // Aner ikke hvorfor vi må kalle callback(), men det må vi, for hvis ikke
            // så blir denne koden til en sutrete liten jente som ikke vil sende oss data
            callback();
        });
    }, function(error) {
        // Jeg har en vag anelse om at callback() egentlig er denne metoden her
        if(error) {
            console.log("There was a devastating error", error);
        } 
        next();
    });
}



module.exports = userService;

