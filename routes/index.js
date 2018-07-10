var express = require('express');
var router = express.Router();
var db = require('../dao/db');
var logger = require('../log/log');

logger.set_logger(null);
/* GET home page. */
router.get('/', function(req, res, next) {
  db.query(('SELECT name FROM users WHERE id = 1;'), function(err, rows, fields) { 
    if (err){
      logger.log(err);
    }
    res.render('index', {data: rows[0]});
  })
});

module.exports = router;
