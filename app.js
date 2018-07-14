var createError = require('http-errors');
var util = require('util');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var logger_morgan = require('morgan');
var expressValidator = require('express-validator');
var indexRouter = require('./routes/index');
var wordsRouter = require('./routes/words');
var userRouter = require('./routes/user');
var examRouter = require('./routes/exam');
_logger = require('./log/log');

_logger.set_logger(null);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger_morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'japanese',
  resave: false,
  saveUninitialized: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressValidator());
app.use('/', indexRouter);
app.use('/words', wordsRouter);
app.use('/user', userRouter);
app.use('/exam', examRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


_checkAuth = (req, res) =>{
  var originalUrl = req.originalUrl;
  if (req.session.user == undefined || req.session.user.password == undefined){ 
    if(originalUrl == undefined) {
      res.redirect(302,'/user/login');
      res.finished = true;
    }
    else {
      res.redirect(302, util.format('/user/login?redirect=%s', encodeURIComponent(originalUrl)));
      console.log(res);
      res.finished = true;
    }
  }
  req.session.isAuth = true;
}