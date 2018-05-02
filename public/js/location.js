$(document).ready(function(){
	// check if position avalible
	if (navigator.geolocation) {

		// ask server for pub locations
		$.post(window.location.href, {},
			function(data, status){
				// parse string data from server
				pubs = JSON.parse(data);

				// start drawing map
				navigator.geolocation.getCurrentPosition(showPosition);
			}
		);
	} else {
		console.log('Not found you');
	}
});

function showPosition(position) {
	// show map with marker on current location
	var latlon = {lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude)};
	var homeMap = new google.maps.Map(document.getElementById('map'), { zoom: 15, center: latlon }); 
	var marker = new google.maps.Marker({position: latlon, map: homeMap}); 

	// add pubs to map
	displayPubs(homeMap);
}
			
function displayPubs(paramMap) {
	// add pub locations
	var markerArray = [];
	for (i = 0; i < pubs.length; i++) {
		var latlon = {lat: parseFloat(pubs[i].lat), lng: parseFloat(pubs[i].lng)};
		markerArray.push(new google.maps.Marker({position: latlon, map: paramMap}));
	}
}