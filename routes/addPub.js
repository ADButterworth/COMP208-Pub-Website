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
	res.render('addPub', {error: false});
});

// POST to /addpub sanitise/verify and insert into db
router.post('/', function (req, res) {
	var sanitisedURL = con.escape(req.body.url);

	// check if url in use
	var sql = "SELECT * FROM pubs WHERE url = " + sanitisedURL;
	con.query(sql, function(error, result, field) {
		if (result.length == 0) {
			var sanitisedName = con.escape(req.body.name);
			var sanitisedDes = con.escape(req.body.description);

			// name not in use, insert requested data into db
			var sql = "INSERT INTO pubs(name, description, url) VALUES (" + sanitisedName + ", " + sanitisedDes + ", " + sanitisedURL + ")";
			con.query(sql, function(error, result, field) {

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