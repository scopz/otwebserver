const express = require('express');
const dbc = require('../src/dbconnection');
const checkLogUser = require('./log').checkLogUser;
const ipUtils = require('ip2long');
const router = express.Router();

/* GET manage main page. */
router.get('/', checkLogUser, async function(req, res, next) {

	try {
		let player = await dbc.query(req, 'SELECT * FROM `players` WHERE account_id=?', [req.session.user.id]);
		res.render('manage', {user: req.session.user, players: player});

	} catch (e) {
		console.log(e);
		next(e);

	} finally {
		dbc.close();
	}
});


/* GET create character page. */
router.get('/create', checkLogUser, function(req, res, next) {
	res.render('create', {user: req.session.user, ret:{}});
});

/* GET create character page. */
router.post('/create', checkLogUser, validate, createUser, function(req, res, next) {
	dbc.close(req);
	if (!req.success) {
		res.render('create', {user: req.session.user, ret:req.body, message:req.message});
	} else {
		res.redirect('/manage');
	}
});


module.exports = router;

async function validate(req, res, next) {
	let name = req.body.name;
	let sex = req.body.sex;

	if (!name || !name.match(/^[A-Z][a-z]+( [A-Z][a-z]+)?$/) || name.length > 20){
		req.success = false;
		req.message = "Name must start with capital letters, have less than 20 characters and no more than 2 words";

	} else if (sex !== "0" && sex !== "1") {
		req.success = false;
		req.message = "Sex value is invalid";

	} else {
		try {
			let found = await dbc.query(req, "SELECT * FROM `players` WHERE name=?", [name]);
			if (found.length > 0) {
				req.success = false;
				req.message = "This name already exists";
			} else {
				req.success = true;
			}
		} catch (e) {
			req.success = false;
			req.message = "An error ocurred validating data";
			console.log(name, e, new Error());
		}
	}
	next();
};


async function createUser(req, res, next) {
	if (req.success) {
		let ip = 0;
		if (req.ip.startsWith("::ffff:")) {
			ip = ipUtils.ip2long(req.ip.substr(7));
		}

		let name = req.body.name;
		let sex = req.body.sex;
		let def = require('../src/default-config').character;

		let connection = dbc.connect(req);
		try {
			await dbc.beginTransaction(connection);

			let info = await dbc.query(connection, "INSERT INTO `players` (`name`,`account_id`,`group_id`,`sex`,`vocation`,`level`,"+
				"`health`,`mana`,`soul`,`direction`,`lookbody`,`lookfeet`,`lookhead`,`looklegs`,`looktype`,`posx`,`posy`,`posz`,`lastip`,"+
				"`conditions`,`town_id`,`balance`,`rank_id`,`guildnick`) VALUES (?,?,1,?,?,?,?,?,?,0,?,?,?,?,?,?,?,?,?,'',?,0,0,'')",
				[name, req.session.user.id, sex, def.vocation, def.level, def.health, def.mana, def.soul, def.lookBody, def.lookFeet,
				def.lookHead, def.lookLegs, sex==1?def.maleOutfitId : def.femaleOutfitId, def.pos.x, def.pos.y, def.pos.z, ip, def.town]);

			if (info.affectedRows == 1) {
				info = await dbc.query(connection, "INSERT INTO `znote_players`(`player_id`, `created`, `hide_char`, `comment`)"+
					" VALUES (?,?,0,'')", [info.insertId, parseInt(new Date().getTime()/1000)]);

				if (info.affectedRows != 1) {
					req.success = false;
					req.message = `An error ocurred creating user [0xef5506-${info.affectedRows}]`;
				}

			} else {
				req.success = false;
				req.message = `An error ocurred creating user [0x4e7492-${info.affectedRows}]`;
			}

			if (req.success) {
				connection.commit();
			} else {
				connection.rollback();
			}
		} catch (e) {
			req.success = false;
			req.message = "An error ocurred creating user [0x82e5a7]";
			console.log(name, e, new Error());
			connection.rollback();
		}
	}
	next();
};