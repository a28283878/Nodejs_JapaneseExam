var express = require('express');
var router = express.Router();
var db = require('../dao/db');
var wordsSQL = require('../dao/wordsSQL');
var logger = require('../log/log');

logger.set_logger(null);

router.get('/:id', function(req, res, next) {
  db.query(wordsSQL.getWordsByIdandUserId, [req.params.id, 1], function(err, rows){
    if(err){
      logger.log(err);
      res.sendStatus(500);
    }
    if (rows[0]!=null && rows[0]!=undefined) res.send(rows[0]);
    else res.sendStatus(404);
  });
});

router.get('/', function(req, res, next) {
  db.query(wordsSQL.queryAll, [1], function(err, rows){
    if(err){
      logger.log(err);
      res.sendStatus(500);
    }
    if (rows[0]!=null && rows[0]!=undefined) res.send(rows);
    else res.sendStatus(404);
  });
});

router.post('/', function(req, res){
  var body = req.body;
  db.query(wordsSQL.insert, [body.word_type, body.word_japanese, body.word_chinese, 1], function(err, rows) {
    if(err){
      logger.log(err);
      res.sendStatus(500);
    }
    res.sendStatus(200);
  });
});

router.put('/', function(req, res){
  var body = req.body;
  db.query(wordsSQL.update, [body.word_type, body.word_japanese, body.word_chinese, 1], function(err, rows) {
    if(err){
      logger.log(err);
      res.sendStatus(500);
    }
    res.sendStatus(200);
  });
})

router.delete('/:id', function(req, res, next) {
  db.query(wordsSQL.deleteWordsById, [req.params.id, 1], function(err, rows){
    if(err){
      logger.log(err);
      res.sendStatus(500);
    }
    res.sendStatus(200);
  });
});

module.exports = router;