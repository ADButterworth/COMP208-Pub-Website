var mysql = require('mysql'); 
fs = require('fs');

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: process.env.MYSQL 
});

con.query("DROP DATABASE pubTestDB", function (err, result) {
 if (err) throw err;
	console.log("    Database dropped");
});

con.query("CREATE DATABASE pubTestDB", function (err, result) {
	if (err) throw err;
	console.log("    Database created");
});

con.query("USE pubTestDB", function (err, result) {
	if (err) throw err;
	console.log("    Database selected");
});

con.query("CREATE TABLE pubs (id INT AUTO_INCREMENT PRIMARY KEY, ownerID INT NOT NULL, name VARCHAR(40), description TEXT, url VARCHAR(15) NOT NULL, address VARCHAR(100) NOT NULL, city VARCHAR(40) NOT NULL, postcode VARCHAR(7) NOT NULL, keywords VARCHAR(40), lng DECIMAL(15,12) NOT NULL DEFAULT 0, lat DECIMAL(15,12) NOT NULL DEFAULT 0)", function (err, result) {
	if (err) throw err;
	console.log("    Table \"Pubs\" created");
});

con.query("CREATE TABLE pubRatings (pubID INT NOT NULL, liveliness INT NOT NULL, price INT NOT NULL);", function (err, result) {
	if (err) throw err;
	console.log("    Table \"pubRatings\" created");
});

con.query("CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(40) NOT NULL, email VARCHAR(256) NOT NULL, name VARCHAR(40), password VARCHAR(255) NOT NULL, isAdmin TINYINT(1) NOT NULL DEFAULT 0)", function (err, result) {
	if (err) throw err;
	console.log("    Table \"Users\" created");
});

con.query("CREATE TABLE pubImages (pubID INT NOT NULL, imageName VARCHAR(40))", function (err, result) {
	if (err) throw err;
	console.log("    Table \"pubImages\" created");
});

con.query("CREATE TABLE userImages (userID INT NOT NULL, imageName VARCHAR(40))", function (err, result) {
	if (err) throw err;
	console.log("    Table \"userImages\" created");
});

fs.readFile(__dirname + "/testData/pubs.sql", "utf8", function (err,data) {
	if (err) {
		return console.log(err);
	}
	con.query(data, function (err, result) {
		if (err) throw err;
		console.log("    Table \"Pubs\" populated");
	});
});

fs.readFile(__dirname + "/testData/pubRatings.sql", "utf8", function (err,data) {
	if (err) {
		return console.log(err);
	}
	con.query(data, function (err, result) {
		if (err) throw err;
		console.log("    Table \"pubRatings\" populated");
	});
});

fs.readFile(__dirname + "/testData/users.sql", "utf8", function (err,data) {
	if (err) {
		return console.log(err);
	}
	con.query(data, function (err, result) {
		if (err) throw err;
		console.log("    Table \"Users\" populated");
	});
});

fs.readFile(__dirname + "/testData/pubImages.sql", "utf8", function (err,data) {
	if (err) {
		return console.log(err);
	}
	con.query(data, function (err, result) {
		if (err) throw err;
		console.log("    Table \"pubImages\" populated");
	});
});

fs.readFile(__dirname + "/testData/userImages.sql", "utf8", function (err,data) {
	if (err) {
		return console.log(err);
	}
	con.query(data, function (err, result) {
		if (err) throw err;
		console.log("    Table \"userImages\" populated");

		con.end();
	});
});