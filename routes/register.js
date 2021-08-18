const express = require('express');
const dbc = require('../src/dbconnection');
const sha1 = require('sha1');
const ipUtils = require('ip2long');
const router = module.exports = express.Router();

router.get('/', function(req, res, next) {
	res.render('register', { ret: {} });
});

router.post('/', validate, createAccount, function(req, res, next) {
	dbc.close(req);
	if (!req.success) {
		res.render('register', {success:false, ret:req.body, message:req.message});
	} else {
		res.render('register', {success:true, ret:req.body});
	}
});



async function validate(req, res, next) {
	let user = req.body.user;
	let pass = req.body.pass;
	let email = req.body.email;

	if (!user || !user.match(/^\d{6,7}$/)){
		req.success = false;
		req.message = "User field must be a numeric of 6 or 7 digits";

	} else if (!pass) {
		req.success = false;
		req.message = "Password field must not be empty";

	} else if (!email) {
		req.success = false;
		req.message = "Email field must not be empty";

	} else {
		try {
			let found = await dbc.query(req, "SELECT * FROM `accounts` WHERE id=? OR email=?", [user, email]);
			if (found.length > 0) {
				req.success = false;
				req.message = "This user or email already exists";
			} else {
				req.success = true;
			}
		} catch (e) {
			req.success = false;
			req.message = "An error ocurred validating data";
			console.log(user, email, e, new Error());
		}
	}
	next();
};


async function createAccount(req, res, next) {
	if (req.success) {
		let user = req.body.user;
		let pass = sha1(req.body.pass);
		let email = req.body.email;

		let connection = dbc.connect(req);
		try {
			await dbc.beginTransaction(connection);

			let info = await dbc.query(connection, "INSERT INTO `accounts` (`id`, `password`, `email`, `premend`, `blocked`, `warnings`)"+
				" VALUES (?,?,?,0,0,0)",[user, pass, email]);

			if (info.affectedRows == 1) {
				let ip = 0;
				if (req.ip.startsWith("::ffff:")) {
					ip = ipUtils.ip2long(req.ip.substr(7));
				}

				info = await dbc.query(connection, "INSERT INTO `znote_accounts` (`account_id`, `ip`, `created`)"+
					" VALUES (?,?,?)", [user, ip, parseInt(new Date().getTime()/1000)]);

				if (info.affectedRows != 1) {
					req.success = false;
					req.message = `An error ocurred creating user [0xf4c31f-${info.affectedRows}]`;
				}

			} else {
				req.success = false;
				req.message = `An error ocurred creating user [0x713b92-${info.affectedRows}]`;
			}

			if (req.success) {
				connection.commit();
			} else {
				connection.rollback();
			}
		} catch (e) {
			req.success = false;
			req.message = "An error ocurred creating user [0x683f27]";
			console.log(user, email, e, new Error());
			connection.rollback();
		}
	}
	next();
};