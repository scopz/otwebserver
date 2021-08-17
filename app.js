const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const path = require('path');
const cookieParser = require('cookie-parser');
const lessModule = require('./src/less-module');
const logger = require('morgan');
const app = express();

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

app.use('*/css', lessModule(__dirname + '/private/less', {
	cache: !DEVELOPMENT,
	compress: !DEVELOPMENT,
	debug: DEVELOPMENT,
}));

app.use(express.static(path.join(__dirname, 'public')));



// session config
app.use(session({
	store: new FileStore({
		path: path.join(__dirname, 'sessions'),
		ttl: 604800 // 1 week
	}),
	name: SESSION_COOKIE_NAME,
	genid: require('uuid').v4,
	cookie: {
		maxAge: 604800000 // 1 week
	},
	secret: 'tibia:ndria',
	resave: true,
	saveUninitialized: false,
	unset: 'destroy'
}));


app.use('/',         require('./routes/index'));
app.use('/',         require('./routes/log').router);
app.use('/manage',   require('./routes/manage'));
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
	res.render('error', {user: req.session.user});
});

module.exports = app;
