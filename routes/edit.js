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
	//only if user is logged in
	if(req.session.userID){
		// Sanitise user input to prevent SQL injection
		var sanitised = con.escape(req.params['pubURL']);
		var sql = 'SELECT pubs.id, pubs.ownerID, pubs.name, pubs.description, users.name AS ownerName FROM pubs LEFT JOIN (users LEFT JOIN userImages ON userID = ID) ON ownerID = users.ID WHERE url = ' + sanitised + ' LIMIT 1';

		// Get list of pubs
		con.query(sql, function(error, result1, field) {
			if (result1.length != 0 && req.session.userID == result1[0].ownerID) {
				res.render('pub', {	name: 			result1[0].name, 
									description: 	result1[0].description, 
									ownerName: 		result1[0].ownerName, 
									username: 		req.session.username,
									admin: 			req.session.admin,
									owner:  		1,
									pubID: 			result1[0].id
				});	
			}
			else {
				// 404 error if no matching pub
				res.redirect('../../404');
			}
		});
	}
	else{
		res.redirect('../login');
	}
});

router.post('/', function (req, res) {
	var sql = 'SELECT pubs.ownerID FROM pubs where id=' +req.body.pubID
	con.query(sql,function(error, result, field){
		if (req.session.userID == result[0].ownerID){
			var sql = 'DELETE FROM pubs WHERE id=' +req.body.pubID
			con.query(sql, function(error, result2, field){
				if (error) {
					router.send("Deletion failed!")
				}
			});
		}
	});
	res.redirect('./');
});

// /pubs should redirect to home
router.get('/', function (req, res) {
	res.redirect('./');
});

// last
module.exports = router;
