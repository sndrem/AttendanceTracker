var firebase = require("firebase");
var async = require("async");
var userService = require("../modules/user-service")
var seminarSchedule = {};

var stringDates;

seminarSchedule.getDatesArray = function(fireBaseRef, req, res, next) {
	var dates = getDates(fireBaseRef);
	var array = dateToArray(dates);
	//addDateToArray(array, "2016-10-03")
	console.log(dateToString(array));
	sortDateArray(array);
	console.log(array);
	return dates;
	next();
}

//get dates from firebase @return string
function getDates(firebaseRef) {
	firebaseRef.once("value", function(snapshot) {
		stringDates = "";
		stringDates += snapshot.val().toString();
		//console.log(snapshot.val().toString());
	});
	return stringDates;
}

//push new date to firebase
seminarSchedule.pushDate = function(firebaseRef, newDate) {
	var dates = getDates(firebaseRef);
	var liveArray = dateToArray(dates);
	addDateToArray(liveArray, newDate);
	sortDateArray(liveArray);
	var arrString = dateToString(liveArray);
	firebaseRef.set(arrString);
}

//dates string to array 
function dateToArray(dateString) {
	var array = dateString.split(",");
	sortDateArray(array);
	return array;
}

//dates array to string
function dateToString(array) {
	var joined = array.join();
	return joined;
}

//add date element to array
function addDateToArray(array, date) {
	array.push(date);
}

//remove date element from array
function removeDateFromArray(array, date) {

}

//change date element in array
function changeDateArray(date) {

}

//sort date array in ascending order
function sortDateArray(array) {
	array.sort(function(a,b) {
		return new Date(a) - new Date(b);
	});
}


module.exports = seminarSchedule;

