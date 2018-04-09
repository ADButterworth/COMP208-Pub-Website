var mysql = require('mysql'); 
fs = require('fs');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: process.env.MYSQL 
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");

	con.query("DROP DATABASE pubTestDB", function (err, result) {
	 if (err) throw err;
		console.log("Database dropped");
	});

	con.query("CREATE DATABASE pubTestDB", function (err, result) {
		if (err) throw err;
		console.log("Database created");
	});

	con.query("USE pubTestDB", function (err, result) {
		if (err) throw err;
		console.log("Database selected");
	});

	con.query("CREATE TABLE pubs (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), description TEXT, url VARCHAR(15))", function (err, result) {
		if (err) throw err;
		console.log("Table \"Pubs\" created");
	});

	fs.readFile(__dirname + "/testData/pubs.sql", "utf8", function (err,data) {
		if (err) {
			return console.log(err);
		}
		con.query(data, function (err, result) {
			if (err) throw err;
			console.log("Table \"Pubs\" populated");
		});

		con.end();
	});
});