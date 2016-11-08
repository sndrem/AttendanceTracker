/*
    Service for all thing courses
    Author: Sindre og Tor
    Date: 04.10.2016
*/

var mysql = require('mysql');
var userService = require("../modules/user-service")
var helper = require('sendgrid').mail;

var messageService ={

    sendMessage: function(req, res, next) {

        var students = JSON.parse(req.body.students);
        console.log("Students: ", students);
        var from_email = new helper.Email('noreply@foribus.com');
        for(var i = 0; i < students.length; i++) {
            var student = students[i];
            console.log("Sending mail to: " + student.name + " with email: " + student.email);
            var to_email = new helper.Email(student.email);
            var subject = 'Mye fravær';
            var content = new helper.Content('text/plain', 'Hei ' + student.name + '\nDu har vært vekke ' + student.beenAway + ' ganger, og dermed står du i fare for å ikke kunne gå opp til eksamen.\nVennligst ta kontakt med din seminarleder dersom du har spørsmål.');
            var mail = new helper.Mail(from_email, subject, to_email, content);

            var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
            var request = sg.emptyRequest({
              method: 'POST',
              path: '/v3/mail/send',
              body: mail.toJSON(),
            });

            sg.API(request, function(error, response) {
              if(error) {
                console.log("Error: ", error);
              }
              console.log("Code: ", response.statusCode);
              console.log("Body: ", response.body);
              console.log("Headerson: ", response.headers);

            });
        }
        next();
    }


}

module.exports = messageService;