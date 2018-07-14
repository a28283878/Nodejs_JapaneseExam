var express = require('express');
var router = express.Router();
var db = require('../dao/db');

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.isAuth = false;
  if (req.session.user != undefined) req.session.isAuth = true;
  res.render('index', {user: req.session.user, isAuth: req.session.isAuth});
});

module.exports = router; 
