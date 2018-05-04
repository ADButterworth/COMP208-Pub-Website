var express = require('express');
var router = express.Router();

// for file uploads
const multer = require('multer');
var storage = multer.diskStorage({
	destination: 'public/img/',

	// rename file to random hex, but keep original ext
	filename: function ( req, file, cb ) {
		let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
		require('crypto').randomBytes(10, function(err, buffer) {
			var token = buffer.toString('hex');
			cb(null, token + ext);
		});
	}
});
const upload = multer({
	storage: storage,
	fileFilter: function (req, file, callback) {
		var ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
		ext = ext.toLowerCase();
		if(ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
			return callback(new Error('Only images are allowed'))
		}
		callback(null, true)
	},
	onError : function(err, next) {
		console.log('error', err);
		next(err);
	}
});

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
	var sql = "SELECT id, password, isAdmin FROM users WHERE username = ?";
	sql = con.format(sql, inserts);
	con.query(sql, function(error, result1, field) {
		// if no user, redir to error, else check password vs hash
		if (result1.length != 0) {
			bcrypt.compare(req.body.password, result1[0].password, function(err, result2) {
				// if password matches hash, show login success, else show invalid password
				if (result2 == true) {
					// server side session variables
					req.session.userID = result1[0].id;
					req.session.username = req.body.username;

					if (result1[0].isAdmin == 1) {
						req.session.admin = 1;
					}
					else {
						req.session.admin = 0;
					}

					// user side cookie to auth with server session
					var hour = 3600000;
					req.session.cookie.expires = new Date(Date.now() + hour);
					req.session.cookie.maxAge = hour;
					res.redirect('../');
					//res.render('login', {msg: true, msgText: "Login success, welcome back " + req.session.username, colour: "#0f0", username: req.session.username, admin: req.session.admin});
				}
				else {
					res.render('login', {msg: true, msgText: "Password invalid", colour: "#f00", username: req.session.username, admin: req.session.admin});
				}
			});
		}
		else {
			res.render('login', {msg: true, msgText: "Username not found", colour: "#f00", username: req.session.username, admin: req.session.admin});
		}
	});
});

// /signup POST should validate and enter user data into DB
router.post('/signup', upload.single('avatar'), function (req, res) {
	if (req.body.secretcode == "COMP208-TestSite") {
		var usernameRE = /^[a-z0-9]+$/i;

		if (usernameRE.test(req.body.username)) {
			// <anything>@<anything>.<anything>
			// not the best email validation, but it'll work
			var emailRE = /\S+@\S+\.\S+/;
			if (emailRE.test(req.body.email)) {
				// check email not in use
				var inserts = [req.body.email, req.body.username];
				var sql = "SELECT id FROM users WHERE email = ? OR username = ?";
				sql = con.format(sql, inserts);

				con.query(sql, function(error, result, field) {
					// if user exists, redir to error, else hash password and store
					if (result.length == 0) {
						bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
							var inserts2 = [req.body.username, req.body.email, req.body.name, hash];
							var sql2 = "INSERT INTO users(username, email, name, password) VALUES (?, ?, ?, ?)";
							sql2 = con.format(sql2, inserts2);

							con.query(sql2, function(error, result, field) {
								if(!error) {
									// get new user ID 
									var inserts3 = [req.body.username];
									var sql3 = "SELECT * FROM users WHERE username = ?";
									sql3 = con.format(sql3, inserts3);
									con.query(sql3, function(error, result3, field) {
										// link image to user
										var inserts = [result3[0].id, req.file.filename];
										var sql = "INSERT INTO userImages (userID, imageName) VALUES (?, ?)"
										sql = con.format(sql, inserts);
										con.query(sql, function(error, result, field) {
											// server side session variables
											req.session.userID = result3[0].id;
											req.session.username = req.body.username;
											req.session.admin = 0;
											
											// redirect to new pages
											res.redirect('/user/' + req.body.username);
										});
									});
								}
								else {
									console.log(error);
									res.render('login', {msg: true, msgText: "Sorry there was an error, please try again.", colour: "#f00", username: req.session.username, admin: req.session.admin});
								}
							});
						});
					}
					else {
						res.render('login', {msg: true, msgText: "That username/email is already in use", colour: "#f00", username: req.session.username, admin: req.session.admin});
					}
				});
			}
			else {
				res.render('login', {msg: true, msgText: "Please enter a proper email", colour: "#f00", username: req.session.username, admin: req.session.admin});
			}
		}
		else {
			res.render('login', {msg: true, msgText: "Please only use alphanumeric characters in your username", colour: "#f00", username: req.session.username, admin: req.session.admin});
		}
	}
	else {
		res.render('login', {msg: true, msgText: "Wrong secret, it will be handed out in the presentation, if you've forgotten email sgabutte@liverpool.ac.uk", colour: "#f00", username: req.session.username, admin: req.session.admin});
	}
});

// last
module.exports = router;