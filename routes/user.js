var express = require('express');
var router = express.Router();

// bcrypt setup
var bcrypt = require('bcrypt');
const saltRounds = 10;

// Open database connection
var mysql = require('mysql');
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: process.env.MYSQL,
	database: "pubTestDB"
});

// /signup should redirect to WIP
router.get('/signup', function (req, res) {
	res.redirect('../WIP');
});

// /login should redirect to login
router.get('/login', function (req, res) {
	res.render('login', {msg: false});
});

// /login should redirect to login
router.post('/login', function (req, res) {
	// <anything>@<anything>.<anything>
	// not the best email validation, but it'll work
	var emailRE = /\S+@\S+\.\S+/;
	if (emailRE.test(req.body.email)) {

		// find user with that email
		var inserts = [req.body.email]
		var sql = "SELECT id, password FROM users WHERE username = ?";
		sql = con.format(sql, inserts);
		con.query(sql, function(error, result, field) {
			console.log(error);
			// if no user, redir to error, else check password vs hash
			if (result.length != 0) {
				bcrypt.compare(req.body.password, result[0].password, function(err, res) {
					// if password matches hash, show login success, else show invalid password
					if (res == true) {
						// should probably be something with cookies or tokens here to remember login success
						res.render('login', {msg: true, msgText: "Login Success"});
					}
					else {
						res.render('login', {msg: true, msgText: "Password invalid"});
					}
				});
			}
			else {
				res.render('login', {msg: true, msgText: "Email invalid"});
			}
		});
	}
	else {
		res.render('login', {msg: true, msgText: "That email is invalid"});
	}
});

// last
module.exports = router;