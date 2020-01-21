var sqlConnect = require('../conf/conf');
var mysql = require('mysql');

var connection = mysql.createPool({
    connectionLimit : 10,
    host: sqlConnect.mysql.host,
    user: sqlConnect.mysql.user,
    password: sqlConnect.mysql.password,
    database: sqlConnect.mysql.database
});
module.exports = connection;