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

// When a pub is requested
router.get('/:pubURL', function (req, res) {
	// Sanitise user input to prevent SQL injection
	var sanitised = con.escape(req.params['pubURL']);
	var sql = 'SELECT * FROM pubs WHERE url = ' + sanitised;

	// Get list of pubs
	con.query(sql, function(error, result, field) {
		if (result.length > 0) {
			res.render('pub', {name: result[0].name, description: result[0].description, imgPath: "../img/" + result[0].url + ".jpg", username: req.session.username});
		}
		else {
			// 404 error if no matching pub
			res.redirect('../../404');
		}
	});
});

// /pubs should redirect to home
router.get('/', function (req, res) {
	res.redirect('./');
});

// last
module.exports = router;