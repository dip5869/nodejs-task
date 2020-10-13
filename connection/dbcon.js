var mysql = require('mysql');

//=================localhost============
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'task_node'
});

module.exports = dbConn;