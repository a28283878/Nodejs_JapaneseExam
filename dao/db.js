var sqlConnect = require('../conf/conf');
var mysql = require('mysql');

var connection = mysql.createConnection(sqlConnect.mysql);
connection.connect(function(err) {
    if (err) throw err
    console.log('You are now connected...')
});

module.exports = connection;