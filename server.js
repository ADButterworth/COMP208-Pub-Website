// Use Express
var express = require('express'); 
var app = express();

app.use(express.static('public'));
app.set('view engine', 'pug');

// Index page
app.get('/', function (req, res) {
   res.render('index', {title: "Pub!", message: "Welcome to Pub!"});
})

// Redirect anything similar to index to index
app.get('/index.?*', function (req, res) {
   res.redirect('/');
})

// 404 ERROR, MUST BE LAST
app.use(function(req,res){
    res.sendFile(__dirname + "/html/404.html")
});

// Server Section
var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})