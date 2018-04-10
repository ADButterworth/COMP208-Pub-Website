// Use Express
var express = require('express'); 
var app = express();

// For POST Params
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.set('view engine', 'pug');

// Index page
app.get('/', function (req, res) {
	res.render('home');
});

// About page
app.get('/about', function (req, res) {
	res.render('about');
});

// About page
app.get('/findapub', function (req, res) {
	res.redirect('/pubs/thefont');
});

// Redirect anything similar to index to index
app.get('/index.?*', function (req, res) {
	res.redirect('/');
});

// Point to pubs router
var pubs = require("./routes/pubs");
app.use('/pubs', pubs);

// Point to addPub router
var addPubs = require("./routes/addPub");
app.use('/addpub', addPubs);

// 404 ERROR, MUST BE LAST
app.get('/404', function (req, res) {
	res.sendFile(__dirname + "/html/404.html");
});
app.use(function(req,res){
	res.redirect('/404');
});

// Server Section
var server = app.listen(5000, function () {
	var host = server.address().address
	var port = server.address().port
   
	console.log("Listening at http://%s:%s", host, port)
});