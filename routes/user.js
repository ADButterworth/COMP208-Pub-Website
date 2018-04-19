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

router.get('/:username', function(req, res) {
	// Sanitise user input to prevent SQL injection
	var sanitised = con.escape(req.params['username']);
	var sql = 'SELECT * FROM users WHERE username = ' + sanitised;

	// Get user with username
	con.query(sql, function(error, result, field) {
		if (result.length != 0) {
			res.render('profile', {name: result[0].name, email: result[0].email, imgPath: "../img/pubs/" + result[0].username + ".jpg", username: req.session.username});
		}
		else {
			// 404 error if no matching user
			res.redirect('../../404');
		}
	});
});

// last
module.exports = router;