var mysql = require('mysql'); 
fs = require('fs');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: process.env.MYSQL 
});

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

con.query("CREATE TABLE pubs (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(40), description TEXT, url VARCHAR(15) NOT NULL, city VARCHAR(40) NOT NULL, postcode VARCHAR(7) NOT NULL, keywords VARCHAR(40))", function (err, result) {
	if (err) throw err;
	console.log("Table \"Pubs\" created");
});

con.query("CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(40) NOT NULL, password VARCHAR(255) NOT NULL)", function (err, result) {
	if (err) throw err;
	console.log("Table \"Users\" created");
});

fs.readFile(__dirname + "/testData/pubs.sql", "utf8", function (err,data) {
	if (err) {
		return console.log(err);
	}
	con.query(data, function (err, result) {
		if (err) throw err;
		console.log("Table \"Pubs\" populated");

		con.end();
	});
});