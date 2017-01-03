var mysql = require('mysql');
var connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    multipleStatements: true
});

console.log('Hello from the connection file');
connection.connect(function(err) {
    if(err) {
        console.log("Error connecting to database. Please check credentials");
    } else {
        console.log("Connected to database. Have a nice day");
    }
})

module.exports = connection;
