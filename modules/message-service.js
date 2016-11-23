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
        var message = JSON.parse(req.body.message);
        var from_email = new helper.Email('noreply@foribus.com');
        for(var i = 0; i < students.length; i++) {
            var student = students[i];
            var formattedMessage = message.replace(/{name}/gi, student.name);
            formattedMessage = formattedMessage.replace(/{beenAway}/gi, student.beenAway);
            var to_email = new helper.Email(student.email);
            var subject = 'Mye fravær';
            var content = new helper.Content('text/html', formattedMessage);
            var mail = new helper.Mail(from_email, subject, to_email, content);

            var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);
            var request = sg.emptyRequest({
              method: 'POST',
              path: '/v3/mail/send',
              body: mail.toJSON(),
            });

            sg.API(request, function(error, response) {
              if(error) {
                next(error);
              }
            });
        }
        next();
    }
}

module.exports = messageService;