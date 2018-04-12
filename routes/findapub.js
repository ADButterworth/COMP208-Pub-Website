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
	res.render('findapub', {});
});

router.post('/', function (req, res) {
	// no injection here
	var sName = con.escape(req.body.name);
	var sCity = con.escape(req.body.city);

	// form query
	var sql = "SELECT * FROM pubs WHERE name = " + sName + " OR city = " + sCity;

	// run query
	con.query(sql, function(error, result, field) {

		// display result
		res.render('findapub', {pubs: result, query: true});
	});
});

// last
module.exports = router;