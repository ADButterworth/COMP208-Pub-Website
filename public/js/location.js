$(document).ready(function(){
	// check if position avalible
	if (navigator.geolocation) {
		$.post(window.location.href, {},
			function(data, status){
				pubs = JSON.parse(data);
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

	displayPubs(homeMap);
}
			
function displayPubs(paramMap) {
	// add pub locations
	console.log(pubs);
	console.log(pubs.length);
	var markerArray = [];
	for (i = 0; i < pubs.length; i++) {
		var latlon = {lat: parseFloat(pubs[i].lat), lng: parseFloat(pubs[i].lng)};
		markerArray.push(new google.maps.Marker({position: latlon, map: paramMap}));
	}
	console.log(markerArray);
}