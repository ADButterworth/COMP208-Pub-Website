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

// location service for map
var googleMapsClient = require('@google/maps').createClient({
	key: 'AIzaSyDqYM9hSp5-xP0X-_b2G10nKQCvpTccX-0'
});

router.post('/', function(req, res) {
	req.session.lat = parseFloat(req.body.location.lat);
	req.session.lng = parseFloat(req.body.location.lng);
	req.session.save()

	res.redirect('/');
});

router.get('/', function(req, res) {
	if (req.query.liveliness && req.session.lat) {
		var preferences = {liveliness: req.query.liveliness, price: req.query.price, distance: req.query.distance};
		var sql = "SELECT * FROM (pubs LEFT JOIN pubImages ON id = pubID) LEFT JOIN pubRatings ON id = pubRatings.pubID;";
		con.query(sql, function(error, result, field) {
			// distance filter
			var distance; 
			var pubs = [];
			for (var i = result.length - 1; i >= 0; i--) {
				distance = getDistance({lat: result[i].lat, lng: result[i].lng}, {lat: req.session.lat, lng: req.session.lng});
				if (distance <= preferences.distance) {
					pubs.push(result[i]);
				}
			}

			var finalPubs = selectPubs(pubs, preferences);
			res.render('matching', {result: finalPubs});
		});
	}
	else {
		if (!req.session.lat) {
			res.render('matching', {error: "Location data not available, please try again"});
		}
		else {
			res.render('matching', {});
		}
	}
});

function selectPubs(initPubs, preferences) {
	const NUMBER_TO_FIND = 5;

	if (initPubs.length <= NUMBER_TO_FIND) {
		return initPubs;
	}
	else {
		// remove worst match
		var worstPub = 0;
		var worstDelta = 0;

		var curDelta;
		for (var i = initPubs.length - 1; i >= 0; i--) {
			curDelta = 0;
			var deltaLiveliness = preferences.liveliness - initPubs[i].liveliness;
			var deltaPrice = preferences.price - initPubs[i].price;
			
			// "distance" from optimum
			curDelta = Math.sqrt((deltaLiveliness * deltaLiveliness) + (deltaPrice * deltaPrice));
			initPubs[i].delta = curDelta;

			if (curDelta > worstDelta) {
				worstPub = i;
				worstDelta = curDelta;
			}
		}

		var nextPubs = [];
		for (var i = initPubs.length - 1; i >= 0; i--) {
			if (i != worstPub) {
				nextPubs.push(initPubs[i]);
			}
		}

		nextPubs.sort(function(a,b) {
			if (a.delta > b.delta) {
				return 1;
			}
			else {
				return -1;
			}
		});

		return selectPubs(nextPubs, preferences);
	}
}

function toRadians(x) {
	return x * Math.PI / 180;
}

// using haversine formula to get "straight" line distances over a sphere
// earth isn't a perfect sphere so this method can be inaccurate over large distances
// for our purpose it will work
function getDistance(location1, location2) {
	var earthRadius = 6371e3;

	var lat1 = toRadians(location1.lat);
	var lat2 = toRadians(location1.lng);
	var changeInLat = toRadians(location2.lat - location1.lat);
	var changeInLng = toRadians(location2.lng - location1.lng);

	var a = (Math.sin(changeInLat/2) * Math.sin(changeInLat/2)) + (Math.cos(lat1) * Math.cos(lat2) * Math.sin(changeInLng/2) * Math.sin(changeInLng/2));

	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

	var d = earthRadius * c;

	d = d / 1000; // m to km
	d = d.toPrecision(4);
	return d;
}

// last
module.exports = router;
