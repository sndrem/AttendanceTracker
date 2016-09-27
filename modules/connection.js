var md5 = require('md5');
var mysql = require('mysql');
var connectObject = {};
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'atdb'
});

connectObject.connect = function() {
    console.log("Connecting to database");
    return connection.connect();
}

module.exports = connectObject;
