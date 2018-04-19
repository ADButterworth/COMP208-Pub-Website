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

// /signup should redirect to login as both forms are on that page
router.get('/signup', function (req, res) {
	res.redirect('/login');
});

// /login should show login page
router.get('/login', function (req, res) {
	res.render('login', {msg: false, username: req.session.username});
});

// /login should show login page
router.get('/logout', function (req, res) {
	req.session.destroy(function() {
		res.render('login', {msg: true, msgText: "Logged out", colour: "#0f0"});
	});
});

// /login POST should validate then set cookie
router.post('/login', function (req, res) {
	// find user with that email
	var inserts = [req.body.username];
	var sql = "SELECT id, password FROM users WHERE username = ?";
	sql = con.format(sql, inserts);
	con.query(sql, function(error, result1, field) {
		// if no user, redir to error, else check password vs hash
		if (result1.length != 0) {
			bcrypt.compare(req.body.password, result1[0].password, function(err, result2) {
				// if password matches hash, show login success, else show invalid password
				if (result2 == true) {
					req.session.userID = result1[0].id;
					req.session.username = req.body.username;

					res.render('login', {msg: true, msgText: "Login success, welcome back " + req.session.username, colour: "#0f0", username: req.session.username});
				}
				else {
					res.render('login', {msg: true, msgText: "Password invalid", colour: "#f00", username: req.session.username});
				}
			});
		}
		else {
			res.render('login', {msg: true, msgText: "Username not found", colour: "#f00", username: req.session.username});
		}
	});
});

// /signup POST should validate and enter user data into DB
router.post('/signup', function (req, res) {
	// <anything>@<anything>.<anything>
	// not the best email validation, but it'll work
	var emailRE = /\S+@\S+\.\S+/;
	if (emailRE.test(req.body.email)) {
		// check email not in use
		var inserts = [req.body.email, req.body.username];
		var sql = "SELECT id FROM users WHERE email = ? OR username = ?";
		sql = con.format(sql, inserts);

		con.query(sql, function(error, result, field) {
			// if no user, redir to error, else check password vs hash
			if (result.length == 0) {
				bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
					var inserts2 = [req.body.username, req.body.email, hash];
					var sql2 = "INSERT INTO users(username, email, password) VALUES (?, ?, ?)";
					sql2 = con.format(sql2, inserts2);

					con.query(sql2, function(error, result, field) {
						if(!error) {
							res.render('login', {msg: true, msgText: "Account Created", colour: "#0f0", username: req.session.username});
						}
					});
				});
			}
			else {
				res.render('login', {msg: true, msgText: "That username/email is already in use", colour: "#f00", username: req.session.username});
			}
		});
	}
	else {
		res.render('login', {msg: true, msgText: "Please enter a proper email", colour: "#f00", username: req.session.username});
	}
});

// last
module.exports = router;