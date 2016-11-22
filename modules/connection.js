var mysql = require('mysql');
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_DATABASE,
    multipleStatements: true
});

console.log("Creating connection and connecting to database");
console.log(connection);

module.exports = connection;
