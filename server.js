// Use Express
var express = require('express'); 
var app = express();

app.use(express.static('public'));
app.set('view engine', 'pug');

// Index page
app.get('/', function (req, res) {
	res.render('home');
})

// About page
app.get('/about', function (req, res) {
	res.render('about');
})

// About page
app.get('/findapub', function (req, res) {
	res.redirect('/pubs/thefont');
})

// Redirect anything similar to index to index
app.get('/index.?*', function (req, res) {
	res.redirect('/');
})

// Point to pubs router
var pubs = require("./routes/pubs");
app.use('/pubs', pubs)

// 404 ERROR, MUST BE LAST
app.get('/notfound', function (req, res) {
	res.sendFile(__dirname + "/html/404.html");
})
app.use(function(req,res){
	res.redirect('/notfound');
});

// Server Section
var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port
   
	console.log("Listening at http://%s:%s", host, port)
})