// Use Express
var express = require('express'); 
var app = express();

// For POST Params
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public'));
app.set('view engine', 'pug');

// === STATIC-ISH PAGES ===
// Index page
app.get('/', function (req, res) {
	res.render('home');
});

// About page
app.get('/about', function (req, res) {
	res.render('about');
});

// Redirect anything similar to index to index
app.get('/index.?*', function (req, res) {
	res.redirect('/');
});
//hey

// === ROUTERS FOR OTHER PAGES ===
// Point to pubs router
var pubs = require("./routes/pubs");
app.use('/pubs', pubs);

// Point to addPub router
var addPubs = require("./routes/addPub");
app.use('/addpub', addPubs);

// Point to findapub router
var find = require("./routes/findapub");
app.use('/findapub', find);

// Point to users router
var find = require("./routes/user");
app.use('/', find);

// === HANDLE 404 REDIR ===
app.get('/404', function (req, res) {
	res.sendFile(__dirname + "/html/404.html");
});
// === HANDLE WIP ERROR ===
app.get('/WIP', function (req, res) {
	res.sendFile(__dirname + "/html/wip.html");
});

// === CATCH ALL 404 REDIRECT FOR NON-EXISTING ROUTES ===
app.use(function(req,res){
	res.redirect('/404');
});

// Open a server on port 5000 
var server = app.listen(5000, function () {
	var host = server.address().address
	var port = server.address().port
   
	console.log("Listening at http://%s:%s", host, port)
});