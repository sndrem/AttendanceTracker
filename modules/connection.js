var mysql = require('mysql');
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    multipleStatements: true
});

connection.connect(function(err) {
    if(err) {
        console.log("Error connecting to database. Please check credentials");
    } else {
        console.log("Connected to database. Have a nice day");
    }
})

console.log("Creating connection and connecting to database");
console.log(connection);

module.exports = connection;
