var db = require('./db');

var user = {};
user.getUserNumByName = function getUserNumByName(username, callback) {
    //使用username 來檢查是否有資料
     var sql = `SELECT id, name, username FROM users WHERE username = ?`;
     db.query(sql, [username], function (err, result) {
         //查詢結果使用 callback 呼叫，並將 err, result 參數帶入
         callback(err,result);                    
     });       
};

user.getUserNumByNameAndPassword = function getUserNumByName(username, password, callback) {
    //使用username 來檢查是否有資料
     var sql = `SELECT id, name, username, password FROM users WHERE username = ? AND password = ?`;
     db.query(sql, [username, password], function (err, result) {
         //查詢結果使用 callback 呼叫，並將 err, result 參數帶入
         callback(err,result);                    
     });       
};

user.createUser = function getUserNumByName(username, name, password, callback) {
    //使用username 來檢查是否有資料

     var sql = `INSERT INTO users (username, name, password) values (?, ?, ?)`
     db.query(sql, [username, name, password], function (err, result) {
         //查詢結果使用 callback 呼叫，並將 err, result 參數帶入
         callback(err,result);                    
     });       
};

module.exports = user;