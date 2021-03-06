var express = require('express');
var router = express.Router();
var db = require('../dao/db');
var wordsSQL = require('../dao/wordsSQL');
var util = require('util');
const { check, validationResult } = require('express-validator/check');

// need to login
router.get('/insert', (req, res) =>{
  _checkAuth(req, res);
  if (res.finished) return res;

  var errors = req.session.errors,
      successes = req.session.successes;
  
  req.session.errors = undefined;
  req.session.successes = undefined;

  res.render('insert', {user: req.session.user, isAuth: req.session.isAuth, errors: errors, successes: successes});
});

router.get('/word_types', (req, res) =>{
  db.query(wordsSQL.getAllWordType, (err, rows) => {
    dbCallback(err, rows);
  });

  function dbCallback(err, rows){
    if (!res.finished){
      if(err){
        _logger.log(err);
        return res.sendStatus(500);
      }

      return res.send(rows);
    }
  }
});

router.get('/all', function(req, res, next) {
  _checkAuth(req, res);
  if (res.finished) return res;
  if(!req.session.user) res.sendStatus(403);
  db.query(wordsSQL.queryAll, [req.session.user.id], function(err, rows){
    dbCallback(err, rows);
  });

  function dbCallback(err, rows){
    if (!res.finished){
      if(err){
        _logger.log(err);
        return res.sendStatus(500);
      }
      
      return res.status(200).render("words", {user: req.session.user, isAuth: req.session.isAuth, words:rows});
    }
  }
});

router.get('/setting', function(req, res, next) {
  _checkAuth(req, res);
  if (res.finished) return res;
  
  db.query(wordsSQL.getWordsByIdandUserId, [req.query.id, req.session.user.id], function(err, rows){
    dbCallback(err, rows);
  });

  function dbCallback(err, rows){
    if (!res.finished){
      if(err){
        _logger.log(err);
        return res.sendStatus(500);
      }
      if (rows[0]!=null && rows[0]!=undefined){ 
        if(rows[0].user_id != req.session.user.id) return res.status(404).redirect("/");
        
        var errors = req.session.errors,
        successes = req.session.successes;

        req.session.errors = undefined;
        req.session.successes = undefined;

        return  res.status(200).render("word_setting", {user: req.session.user, isAuth: req.session.isAuth, word:rows[0], errors: errors, successes: successes});
      }
      else return res.sendStatus(404);
    }
  }
});

router.post('/setting',[check('word_type').isNumeric().withMessage("word type need to be numeric").not().isEmpty().withMessage("word type could not be empty"),
check('word_japanese').isString().withMessage("japanese need to be string").not().isEmpty().withMessage("japanese could not be empty"),
check('word_chinese').isString().withMessage("chinese need to be string").not().isEmpty().withMessage("chinese could not be empty"),
check('id').isNumeric().withMessage("id need to be numeric").not().isEmpty().withMessage("id could not be empty")]
, function(req, res){
  var body = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.errors = errors.array();
    return res.status(422).redirect(req.originalUrl);
  }
  if(!req.session.user) return res.status(403).redirect('/user/login');
  db.query(wordsSQL.update, [body.word_type, body.word_japanese, body.word_chinese, req.session.user.id, body.id], function(err, rows) {
    if(err){
      _logger.log(err);
      res.sendStatus(500);
    }
    if(req.query.redirect) res.redirect(req.query.redirect);
    else res.redirect('/');
  });
})

router.get('/:id', function(req, res, next) {
  _checkAuth(req, res);
  if (res.finished) return res;
  if(!req.session.user) res.sendStatus(403);
  db.query(wordsSQL.getWordsByIdandUserId, [req.params.id, req.session.user.id], function(err, rows){
    dbCallback(err, rows);
  });

  function dbCallback(err, rows){
    if (!res.finished){
      if(err){
        _logger.log(err);
        return res.sendStatus(500);
      }
      if (rows[0]!=null && rows[0]!=undefined){ 
        if(rows[0].user_id != req.session.user.id) return res.status(403).redirect("/");
        return res.send(rows[0]);
      }
      else return res.sendStatus(404);
    }
  }
});

router.post('/insert',[check('word_type').isNumeric().withMessage("word type need to be numeric").not().isEmpty().withMessage("word type could not be empty"),
  check('word_japanese').isString().withMessage("japanese need to be string").not().isEmpty().withMessage("japanese could not be empty"),
  check('word_chinese').isString().withMessage("chinese need to be string").not().isEmpty().withMessage("chinese could not be empty")], 
  function(req, res){
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.session.errors = errors.array();
    return res.status(422).redirect('/words/insert');
  }
  if(!req.session.user) return res.status(403).redirect('/user/login');
  var body = req.body;
  
  db.query(wordsSQL.insert, [body.word_type, body.word_japanese, body.word_chinese, req.session.user.id], function(err, rows) {
    if(err){
      _logger.log(err);
      res.sendStatus(500);
    }
    req.session.successes = [{msg:"successfully insert"}];
    res.redirect('/words/insert');
  });
});

router.delete('/:id', function(req, res, next) {
  if(!req.session.user) res.sendStatus(403);
  db.query(wordsSQL.deleteWordsById, [req.params.id, req.session.user.id], function(err, rows){
    if(err){
      _logger.log(err);
      res.sendStatus(500);
    }
    res.sendStatus(200);
  });
});


module.exports = router;