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
	var homeMap = new google.maps.Map(document.getElementById('map'), { zoom: 15, center: latlon, disableDefaultUI: true}); 
	img = window.location.href + "/img/user pin.png"
	var marker = new google.maps.Marker({
		position: latlon, 
		map: homeMap, 
		icon: img
	}); 
	google.maps.event.addListener(marker, 'click', function() {
		window.location.href = this.url;
	});
	// add pubs to map
	displayPubs(homeMap);

}
			
function displayPubs(paramMap) {
	// add pub locations
	var markerArray = [];
	for (i = 0; i < pubs.length; i++) {
		var latlon = {lat: parseFloat(pubs[i].lat), lng: parseFloat(pubs[i].lng)};
		var marker = new google.maps.Marker({position: latlon, map: paramMap, url: window.location.href + "pubs/" + pubs[i].url});
		console.log(marker.url);
		google.maps.event.addListener(marker, 'click', function() {
			window.location.href = this.url;
		});
		markerArray.push(marker)
	}
}