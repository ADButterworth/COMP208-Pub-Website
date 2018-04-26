var express = require('express');
var router = express.Router();

var googleMapsClient = require('@google/maps').createClient({
	key: 'AIzaSyDqYM9hSp5-xP0X-_b2G10nKQCvpTccX-0'
});

// Open database connection
router.get('/', function(req,res){
	// Geocode an address.
	googleMapsClient.geocode({
		address: 'L66DN'
	}, 
	function(err, response) {
		if (!err) {
			res.render('harvey', {lat: response.json.results[0].geometry.location.lat, lng: response.json.results[0].geometry.location.lng});
		}
	});
});

//last
module.exports = router;
