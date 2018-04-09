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
	// TODO Add logic and database insertion
});

// last
module.exports = router;