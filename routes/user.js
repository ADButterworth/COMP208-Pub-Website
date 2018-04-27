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
	var sql = 'SELECT * FROM users JOIN userImages ON users.id = userImages.userID WHERE username = ' + sanitised;

	// Get user with username
	con.query(sql, function(error, result, field) {
		if (result.length != 0) {
			// if they are the owner then show their pubs, else only show profile page
			if (req.session.username == req.params['username']) {
				var sql2 = 'SELECT DISTINCT * FROM pubs WHERE ownerID = ' + result[0].id;
				con.query(sql2, function(error, result2, field) {
					res.render('profile', {name: result[0].name, email: result[0].email, imgPath: "../img/" + result[0].imageName, pubs: result2, username: req.session.username});
				});
			}
			else {
				res.render('profile', {name: result[0].name, email: result[0].email, imgPath: "../img/" + result[0].imageName, username: req.session.username});
			}
		}
		else {
			// 404 error if no matching user
			res.redirect('../../404');
		}
	});
});

// last
module.exports = router;