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

router.get("/", function(req, res) {
	// verify user is an admin
	if (req.session.admin == 1) {
		var sql = "SELECT pubs.id, users.id AS ownerID, pubs.name, pubs.url, users.name AS owner, users.username, userImages.imageName AS userImage, pubImages.imageName AS pubImage FROM ((pubs LEFT JOIN users ON users.id = ownerID) LEFT JOIN pubImages ON pubs.id = pubID) LEFT JOIN userImages ON users.id = userID ORDER BY ownerID DESC;";
		con.query(sql, function(error, result, field) {
			res.render('admin', {result: result, username: req.session.username, admin: req.session.admin});
		});
	}
	else {
		res.redirect("/login")
	}
});

// last
module.exports = router;