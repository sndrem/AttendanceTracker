var mysql = require('mysql');
var connectObject = {};
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_DATABASE,
    multipleStatements: true
});

connectObject.connect = function() {
    console.log("Connecting to database");
    return connection.connect();
}

module.exports = connectObject;
