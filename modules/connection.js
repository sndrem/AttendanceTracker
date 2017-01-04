var mysql = require('mysql');
var dbConfig = {
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    multipleStatements: true
};

var pool = mysql.createPool(dbConfig);

// function handleDisconnect() {
//     connection = mysql.createConnection(dbConfig);

//     connection.connect(function(err) {
//         if(err) {
//             console.log("Error connecting to database.", err);
//             setTimeout(handleDisconnect, 2000);
//         } else {
//             console.log("Connected to database. Have a nice day");
//         }
//     })

//     connection.on('error', function(err) {
//         console.log('db error', err);
//         if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//           handleDisconnect();                         // lost due to either server restart, or a
//         } else {                                      // connnection idle timeout (the wait_timeout
//           throw err;                                  // server variable configures this)
//         }
//       });
// }

// handleDisconnect();

module.exports = pool;
