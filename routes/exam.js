var express = require('express');
var router = express.Router();
var db = require('../dao/db');
var wordsSQL = require('../dao/wordsSQL');
const { check, validationResult } = require('express-validator/check');

router.get('/', function(req, res, next) {
    _checkAuth(req, res);
    if (res.finished) return res;

    res.render('exam', {user: req.session.user, isAuth: req.session.isAuth});
});

router.get('/reading', function(req, res, next) {
    _checkAuth(req, res);
    if (res.finished) return res;
    if(!req.query.num){
        return res.status(200).render("reading", {user: req.session.user, isAuth: req.session.isAuth});
    }
    db.query(wordsSQL.queryAll, [req.session.user.id], function(err, rows){
      if(req.query.num){
        if(req.query.num > rows.length) dbCallback(err, rows);
        else{
            rows.forEach((element, index)=>{
                var randNum = Math.floor(Math.random()*rows.length);
                var temp_row = rows[index];
                rows[index] = rows[randNum];
                rows[randNum] = temp_row;
            });
            dbCallback(err, rows.slice(0, req.query.num));
        }
      }
    });
  
    function dbCallback(err, rows){
      if (!res.finished){
        if(err){
          _logger.log(err);
          return res.sendStatus(500);
        }
        return res.status(200).render("reading", {user: req.session.user, isAuth: req.session.isAuth, words:rows});
      }
    }
});

router.get('/listening', function(req, res, next) {
    _checkAuth(req, res);
    if (res.finished) return res;
    if(!req.query.num){
        return res.status(200).render("listening", {user: req.session.user, isAuth: req.session.isAuth});
    }
    db.query(wordsSQL.queryAll, [req.session.user.id], function(err, rows){
        if(req.query.num > rows.length) dbCallback(err, rows);
        else{
            rows.forEach((element, index)=>{
                var randNum = Math.floor(Math.random()*rows.length);
                var temp_row = rows[index];
                rows[index] = rows[randNum];
                rows[randNum] = temp_row;
            });
            dbCallback(err, rows.slice(0, req.query.num));
        }
    });
  
    function dbCallback(err, rows){
      if (!res.finished){
        if(err){
          _logger.log(err);
          return res.sendStatus(500);
        }
        return res.status(200).render("listening", {user: req.session.user, isAuth: req.session.isAuth, words:rows});
      }
    }
});

router.get('/checkAns', function(req, res, next) { 
    if(req.query.id){
        db.query(wordsSQL.getWordsByIdandUserId, [req.query.id, req.session.user.id], function(err, rows){
            if (rows[0]!=null && rows[0]!=undefined) dbCallback(err, rows);
            else return res.status(400).send({"msg":"id doesn't exist"});
        });
    }
    else{
        return res.status(400).send({"msg":"id is null"});
    }

    function dbCallback(err, rows){
      if (!res.finished){
        if(err){
          _logger.log(err);
          return res.sendStatus(500);
        }
        
        if(req.query.type){
            if(req.query.ans){
                if(req.query.type == "j2c"){
                    var correctAnswers = rows[0].word_chinese.split(",");
                    console.log(req.query.ans)
                    var correct = false;
                    correctAnswers.forEach(element => {
                        if(element == req.query.ans){
                            correct = true;
                            return res.status(200).send({"correct": true,"msg":rows[0].word_chinese});
                        }
                    });
                    
                    if (!correct) return res.status(200).send({"correct": false,"msg":rows[0].word_chinese});
                }
                else if(req.query.type == "c2j"){

                }
                else return res.status(400).send({"msg":"type undifined"});
            }
            else return res.status(400).send({"msg":"type is null"});
        }
        else return res.status(400).send({"msg":"type is null"});
      }
    }
});

module.exports = router;