// Use Express
var express = require('express'); 
var app = express();

// For POST Params
app.use(express.json());
app.use(express.urlencoded({
	extended: true
}));

// provides protection against common well-known vulnerabilities 
var helmet = require('helmet');
app.use(helmet());

// server side session data, for logins etc. 
var session = require('express-session')
app.set('trust proxy', 1); // trust first proxy
app.use(session({
	secret: '21d25ff2fd5edc7f566fdc0fafa9feb365036043038bf7b250',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false } // this is fine as cookie passed by HTTPS to nginx then routed internally only using HTTP
}));

// set public dir
app.use(express.static('public'));

// set pug as the html templater 
app.set('view engine', 'pug');

// === STATIC-ISH PAGES ===
// Index page
app.get('/', function (req, res) {
	res.render('home', {username: req.session.username, admin: req.session.admin});
});

// About page
app.get('/about', function (req, res) {
	res.render('about', {username: req.session.username, admin: req.session.admin});
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

// Point to signup router
var signup = require("./routes/signin");
app.use('/', signup);

// Point to users router
var users = require("./routes/user");
app.use('/user', users);

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