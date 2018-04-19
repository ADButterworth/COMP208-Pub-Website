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

// /findapub should show search page
router.get('/', function (req, res) {
	res.render('findapub', {username: req.session.username});
});

router.post('/', function (req, res) {
	// no injection here
	var sName = con.escape(req.body.name);
	var sCity = con.escape(req.body.city);
	var sKeyword = con.escape("%" + req.body.keyword + "%");

	// form query
	var sql = "SELECT * FROM pubs WHERE name = " + sName + " OR city = " + sCity + " OR keywords LIKE " + sKeyword;

	// run query
	con.query(sql, function(error, result, field) {
		res.render('findapub', {pubs: result, query: true, username: req.session.username});
	});
});

// last
module.exports = router;