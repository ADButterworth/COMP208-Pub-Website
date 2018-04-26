var express = require('express');
var router = express.Router();
var request = require('request');




// Open database connection
router.get('/', function(req,res){
	request.post(
    'https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyCufaYe9XTElRrifvNPo3HM6mC8LBoy2Tw',
    { json: {} },
    function (error, response, body) {
        if (!error && response.statusCode == 200) {
            //res.send(body)
			res.render('harvey', {lat: body.location.lat, lng: body.location.lng} )
	        }
	    else {
	    	res.render('harvey', {lat: 0, lng: 0} )

	    }
	    }
	);

});

//last
module.exports = router;
