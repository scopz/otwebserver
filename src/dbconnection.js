const mysql = require('mysql2');
const IncomingMessage = require('http').IncomingMessage;

function newConnection(){
	let connection = mysql.createConnection({
		host    : MYSQL_DB.HOST,
		port    : MYSQL_DB.PORT,
		user    : MYSQL_DB.USER,
		password: MYSQL_DB.PASSWORD,
		database: MYSQL_DB.DATABASE,
	});

	let originStack = new Error().stack;
	connection.on('error', function(){
		console.log(new Date(), "Connection error:");
		console.log.apply(this,arguments);
		console.log(originStack);
	});

	return connection;
}

function connect(req){
	let connection;
	if (req == undefined){
		connection = newConnection();
		connection.connect();
		
	} else if (req.mysqlConn == undefined){
		connection = newConnection();
		connection.connect();
		req.mysqlConn = connection;

	} else {
		connection = req.mysqlConn;
	}
	return connection;
}

module.exports = 
{
	connect: connect,

	close: (req)=>{
		if (!req) throw new Error("Close must receive a connection or request");

		let connection;
		if (req instanceof IncomingMessage){
			connection = req.mysqlConn;
			req.mysqlConn = undefined;
		} else {
			connection = req;
		}

		if (connection != undefined) {
			connection.end();
		}
	},

	query: (req, sql, params)=>{
		return new Promise((resolve,reject)=>{
			let con;
			if (req instanceof IncomingMessage){
				con = connect(req);
			} else {
				con = req;
			}
			con.query(sql, params, function(err, rows, fields) {
				if (err){
					reject(err); // Internal Server Error
				} else {
					resolve(rows);
				}
			});
		});
	},

	beginTransaction: connection=>{
		return new Promise((resolve,reject)=>{
			connection.beginTransaction(err=>{
				if (err) reject(err);
				else resolve();
			});
		});
	}
}

