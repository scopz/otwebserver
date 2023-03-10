const createError = require('http-errors');
const express = require('express');
const dbc = require('../src/dbconnection');
const checkLogUser = require('./log').checkLogUser;
const ipUtils = require('ip2long');
const router = module.exports = express.Router();
const defaults = require('../src/default-config');

/* GET manage main page. */
router.get('/', checkLogUser, async function(req, res, next) {

	try {
		let players = await dbc.query(req, 'SELECT * FROM `players` WHERE account_id=?', [req.session.user.id]);
		players.forEach(p => p.vocation = defaults.vocations[p.vocation])
		players.sort((a,b) => a.name == b.name? 0 : a.name < b.name? -1 : 1);

		res.render('manage', {user: req.session.user, players: players});

	} catch (e) {
		console.log(e);
		next(e);

	} finally {
		dbc.close(req);
	}
});


/* GET create character page. */
router.get('/create', checkLogUser, function(req, res, next) {
	res.render('create-character', {user: req.session.user, ret:{}});
});

/* POST delete character. */
router.post('/create', checkLogUser, validateCreation, createUser, function(req, res, next) {
	dbc.close(req);
	if (!req.success) {
		res.render('create-character', {user: req.session.user, ret:req.body, message:req.message});
	} else {
		res.redirect('/manage');
	}
});

/* POST delete character page. */
router.post('/delete', checkLogUser, deleteUser, async function(req, res, next) {
	dbc.close(req);

	if (!req.success) {
		res.status(400);
		res.json({
			success: false,
			msg: req.message,
		});
	} else {
		res.json({
			success: true,
			id: req.body.id,
		})
	}
});


async function validateCreation(req, res, next) {
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
}

async function createUser(req, res, next) {
	if (req.success) {
		let ip = 0;
		if (req.ip.startsWith("::ffff:")) {
			ip = ipUtils.ip2long(req.ip.substr(7));
		}

		let name = req.body.name;
		let sex = req.body.sex;
		let def = defaults.character;

		let connection = dbc.connect(req);
		try {
			await dbc.beginTransaction(connection);

			let info = await dbc.query(connection, "INSERT INTO `players` (`name`,`account_id`,`group_id`,`sex`,`vocation`,`level`,"+
				"`health`,`mana`,`direction`,`lookbody`,`lookfeet`,`lookhead`,`looklegs`,`looktype`,`posx`,`posy`,`posz`,`lastip`,"+
				"`conditions`,`town_id`,`balance`,`rank_id`,`guildnick`) VALUES (?,?,1,?,?,?,?,?,0,?,?,?,?,?,?,?,?,?,'',?,0,0,'')",
				[name, req.session.user.id, sex, def.vocation, def.level, def.health, def.mana, def.lookBody, def.lookFeet,
				def.lookHead, def.lookLegs, sex==1?def.maleOutfitId : def.femaleOutfitId, def.pos.x, def.pos.y, def.pos.z, ip, def.town]);

			if (info.affectedRows == 1) {
				info = await dbc.query(connection, "INSERT INTO `znote_players`(`player_id`, `created`, `hide_char`, `comment`)"+
					" VALUES (?,?,0,'')", [info.insertId, parseInt(new Date().getTime()/1000)]);

				if (info.affectedRows != 1) {
					req.success = false;
					req.message = `An error ocurred creating character [0xef5506-${info.affectedRows}]`;
				}

			} else {
				req.success = false;
				req.message = `An error ocurred creating character [0x4e7492-${info.affectedRows}]`;
			}

			if (req.success) {
				connection.commit();
			} else {
				connection.rollback();
			}
		} catch (e) {
			req.success = false;
			req.message = "An error ocurred creating character [0x82e5a7]";
			console.log(name, e, new Error());
			connection.rollback();
		}
	}
	next();
}

async function deleteUser(req, res, next) {
	req.success = true;

	try {
		let info = await dbc.query(req, 'DELETE FROM `players` WHERE id=? AND account_id=?', [req.body.id, req.session.user.id]);

		if (info.affectedRows != 1) {
			req.message = `An error ocurred deleting character [0x24f29c-${req.body.id}-${info.affectedRows}]`;
			req.success = false;
		}

	} catch (e) {
		console.log(e);
		req.message = `An error ocurred deleting character [0xa98e72-${req.body.id}]`;
		req.success = false;

	}

	next();
}