var express = require('express');
var router = express.Router();

// for file uploads
const multer = require('multer');
var storage = multer.diskStorage({
	destination: 'public/img/',

	// rename file to random hex, but keep original ext
	filename: function ( req, file, cb ) {
		let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
		require('crypto').randomBytes(10, function(err, buffer) {
			var token = buffer.toString('hex');
			cb(null, token + ext);
		});
	}
});
const upload = multer({
	storage: storage,
	fileFilter: function (req, file, callback) {
		var ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
		if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
			return callback(new Error('Only images are allowed'))
		}
		callback(null, true)
	},
	onError : function(err, next) {
		console.log('error', err);
		next(err);
	}
});

// Open database connection
var mysql = require('mysql');
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: process.env.MYSQL,
	database: "pubTestDB"
});

// /addpub basic render, no query run yet
// if user not logged in redir to login page
router.get('/', function (req, res) {
	if (req.session.userID) {
		res.render('addPub', {error: false, username: req.session.username, admin: req.session.admin});
	}
	else {
		res.redirect('./login');
	}
});

// POST to /addpub sanitise/verify and insert into db
router.post('/', upload.single('avatar'), function (req, res, next) {
	if (req.session.userID) {
		var sURL = con.escape(req.body.url);

		// check if url in use
		var sql = "SELECT * FROM pubs WHERE url = " + sURL;
		con.query(sql, function(error, result, field) {
			if (result.length == 0) {
				var description = mysql.raw(con.escape(req.body.description).replace(/\\r\\n/g, '<br/>'));
				// name not in use, insert requested data into db
				var inserts = [req.body.name, req.session.userID, req.body.url, req.body.city, req.body.postcode, req.body.keywords, description];
				var sql = "INSERT INTO pubs(name, ownerID, url, city, postcode, keywords, description) VALUES (?, ?, ?, ?, ?, ?, ?);";
				sql = con.format(sql, inserts);

				// insert data into db
				con.query(sql, function(error, result, field) {
					// get new pub ID 
					var sql = "SELECT * FROM pubs WHERE url = " + sURL;
					con.query(sql, function(error, result2, field) {
						// link image to pub
						var inserts = [result2[0].id, req.file.filename];
						var sql = "INSERT INTO pubImages (pubID, imageName) VALUES (?, ?)"
						sql = con.format(sql, inserts);
						con.query(sql, function(error, result, field) {
							// redirect to new pages
							res.redirect('../pubs/' + req.body.url);
						});
					});
				});
			}
			else {
				res.render('addPub', {error: true, username: req.session.username, admin: req.session.admin});
			}
		});
	}
	else {
		res.redirect('./login');
	}
});

// last
module.exports = router;