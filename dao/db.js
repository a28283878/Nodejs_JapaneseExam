var sqlConnect = require('../conf/conf');
var mysql = require('mysql');

var connection = mysql.createPool({
    host: sqlConnect.host,
    user: sqlConnect.user,
    password: sqlConnect.password,
    database: sqlConnect.database
});

module.exports = connection;