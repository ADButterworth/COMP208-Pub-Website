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
	var sql = 'SELECT * FROM pubs WHERE url = ' + sanitised + ' LIMIT 1';

	// Get list of pubs
	con.query(sql, function(error, result1, field) {
		if (result1.length != 0) {
			var sql2 = 'SELECT imageName FROM pubImages WHERE pubID = ' + result1[0].id + ' LIMIT 1';
			con.query(sql2, function(error, result2, field) {
				if (result2) {
					res.render('pub', {name: result1[0].name, description: result1[0].description, imgPath: "../img/" + result2[0].imageName, username: req.session.username});
				}
				else {
					res.render('pub', {name: result1[0].name, description: result1[0].description, username: req.session.username});
				}
			});
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