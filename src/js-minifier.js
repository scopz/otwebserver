const createError = require('http-errors');
const babel = require('babel-core');
const fs = require('fs');

let babelOpts;
let filePath;
let codes = {};

module.exports = function(path,opts){
	filePath = path.replace(/\/?$/,'');
	babelOpts = opts;
	codes = {};
	return router;
}

function router(req, res, next) {
	let filename = filePath+req.url;

	let code = codes[filename];
	let update = !code;

	try {
		if (DEVELOPMENT) {
			let stats = fs.statSync(filename);
			let mtime = stats.mtime.getTime();

			if (update) {
				code = {m: mtime};

			} else if (code.m && code.m < mtime) {
				update = true;
				code = {m: mtime};
			}
		}

		if (update) {
			babel.transformFile(filename, babelOpts, function (err, result) {
				if (err) {
					if (err.code != 'ENOENT') {
						console.log(err);
					}
					next(createError(404));
				} else {
					code = code || {};
					code.c = result.code;
					codes[filename] = code;
					res.set('Content-Type', 'text/javascript; charset=utf-8')
					res.send(code.c);
				}
			});

		} else {
			res.set('Content-Type', 'text/javascript; charset=utf-8')
			res.send(code.c);
		}
	} catch (e) {
		if (e.code != 'ENOENT') {
			console.log(e);
		}
		next(createError(404));
	}

}