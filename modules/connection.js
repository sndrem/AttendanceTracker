var mysql = require('mysql');
var connectObject = {};
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'atdb',
    multipleStatements: true
});

connectObject.connect = function() {
    console.log("Connecting to database");
    return connection.connect();
}

module.exports = connectObject;
