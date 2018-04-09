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
	res.render('addPub');
});

router.post('/', function (req, res) {
	var sanitisedURL = con.escape(req.body.url);
	var sql = "SELECT * FROM pubs WHERE url = " + sanitisedURL;

	con.query(sql, function(error, result, field) {
		if (result.length == 0) {
			var sanitisedName = con.escape(req.body.name);
			var sanitisedDes = con.escape(req.body.description);

			var sql = "INSERT INTO pubs(name, description, url) VALUES (" + sanitisedName + ", " + sanitisedDes + ", " + sanitisedURL + ")";

			con.query(sql, function(error, result, field) {
				res.redirect('../../pubs/' + req.body.url);
			});
		}
		else {
			res.send("Error: URL Already Exists");
		}
	});
});

// last
module.exports = router;