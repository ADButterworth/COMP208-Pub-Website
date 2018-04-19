var express = require('express');
var router = express.Router();

// Open database connection
var mysql = require('mysql');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: process.env.MYSQL,
	database: "pubTestDB"
});

// /addpub should redirect to home
router.get('/', function (req, res) {
	res.render('addPub', {error: false, username: req.session.username});
});

// POST to /addpub sanitise/verify and insert into db
router.post('/', function (req, res) {
	var sURL = con.escape(req.body.url);

	// check if url in use
	var sql = "SELECT * FROM pubs WHERE url = " + sURL;
	con.query(sql, function(error, result, field) {
		if (result.length == 0) {
			// name not in use, insert requested data into db
			var inserts = [req.body.name, req.body.description, req.body.url, req.body.city, req.body.postcode, req.body.keywords];
			var sql = "INSERT INTO pubs(name, description, url, city, postcode, keywords) VALUES (?, ?, ?, ?, ?, ?);";
			sql = con.format(sql, inserts);

			con.query(sql, function(error, result, field) {
				console.log(error)
				// redirect to new pages
				res.redirect('../pubs/' + req.body.url);
			});
		}
		else {
			res.render('addPub', {error: true});
		}
	});
});

// last
module.exports = router;