var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var lessModule = require('./src/less-module');
var logger = require('morgan');
var minify = require('express-minify');
var app = express();

global.DEVELOPMENT = app.get('env') === 'development';

// less compiler option:
app.locals.pretty = DEVELOPMENT;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

if (DEVELOPMENT) {
  app.use(logger('dev'));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(minify());
app.use(express.static(path.join(__dirname, 'public')));
app.use('*/css', lessModule(__dirname + '/public/css', {
	cache: !DEVELOPMENT,
	compress: !DEVELOPMENT,
	debug: DEVELOPMENT,
}));

app.use('/',         require('./routes/index'));
app.use('/register', require('./routes/register'));
app.use('/users',    require('./routes/users'));

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
