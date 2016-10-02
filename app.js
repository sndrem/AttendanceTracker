var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require("express-validator");
var session = require('client-sessions');


var userService = require("./modules/user-service");
var routes = require('./routes/index');
var students = require('./routes/students');
var assistants = require('./routes/assistants');
var admins = require('./routes/admins');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator());
app.use(cookieParser());
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true,
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/students", express.static("public"));
app.use("/assistant", express.static("public"));
app.use("/students/seminarDetails/:courseKey/:seminarKey", express.static("public"));
app.use("/students/seminarDetails/:courseKey", express.static("public"));
app.use(session({
    cookieName: 'session',
    secret: '387fgrhgur87euy8whfseyugd#/$&/"rhdYGDYF/',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true
}));

// Denne metoden kjøres på hver eneste request og sjekker om det finnes en session
// for en user. Hvis det gjør det, så oppdaterer den session med riktige data fra databasen
app.use(function(req, res, next){
    // Hvis det finnes en bruker
    if(req.session && req.session.user) {
        // Lagre brukeren til session
        userService.getUser(req.session.user.eMail, function(err, user) {
            if(err) {
                next();
            }  else {
                if(user) {
                    req.user = user[0];
                    delete req.user.password;
                    req.session.user = user[0];
                    res.locals.user = user[0];
                    next();
                }
            }
        });

    } else {
        next();
    }
});

// Denne metoden kjøres på hver eneste request og sjekker hvilken admin-type en bruker er
// Dersom det ikke finnes en admintype så vet vi at vi har med en student å gjøre
app.use(function(req, res, next) {
    if(req.session && req.session.user) {
        userService.isAdmin(req, res, next);
    } else {
        next();
    }
});

app.use('/', routes);
app.use('/student', students);
app.use('/assistant', assistants);
app.use('/admin', admins);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
//
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.set('port', 3000);
app.listen(app.get('port'), function() {
  console.log("App started on " + app.get('port') + ". To terminate press Ctrl+C");
});


module.exports = app;
