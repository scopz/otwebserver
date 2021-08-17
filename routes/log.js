const express = require('express');
const dbc = require('../src/dbconnection');
const sha1 = require('sha1');
const router = express.Router();

/* GET login page. */
router.get('/login', function(req, res, next) {
	res.render('login', {ret: {}, r: req.query.r});
});

/* GET login page. */
router.post('/login', async function(req, res, next) {

	let user = req.body.user;
	let pass = sha1(req.body.pass);

	try {
		let found = await dbc.query(req, 'SELECT id, email, premend FROM `accounts` WHERE id=? AND password=?', [user, pass]);
		if (found.length == 1) {
			req.session.user = found[0];
			res.redirect(req.query.r? req.query.r : '/manage');

		} else {
			res.render('login', {ret: req.body, message: 'User or password incorrect', r: req.query.r});
		}
	} catch (e) {
		res.render('login', {ret: req.body, message: 'An error ocurred validating data', r: req.query.r});
		console.log(user, e, new Error());
	} finally {
		dbc.close(req);
	}
});


/* GET logout page. */
router.get('/logout', function(req, res, next) {
	req.session.destroy(err=>{
		if (err) console.log(err);
		res.clearCookie(SESSION_COOKIE_NAME);
		let referrer = req.get('referrer');
		if (referrer){
			res.redirect(referrer);
		} else {
			res.redirect('/');	
		}
	});
});

module.exports = {
	router: router,
	checkLogUser: checkLogUser,
} 


function checkLogUser(req, res, next){
	if (!req.session.user) {
		res.redirect('/login?r='+encodeURIComponent(req.baseUrl+req.url));
		return false;

	} else {
		next();
		return true;
	}
}
