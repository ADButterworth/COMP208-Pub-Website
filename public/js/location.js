$(document).ready(function(){
	// check if position avalible
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);

		// ask server for pub locations
		$.post(window.location.href, {reason:"getpublocations"},
			function(data, status){
				// parse string data from server
				pubs = JSON.parse(data);
			}
		);
	} else {
		// tell server location services not allowed
		$.post(window.location.href, {reason:"nolocationerror"},
			function(data, status){
				window.location.href = data;
			}
		);
	}
});

function showPosition(position) {
	// show map with marker on current location
	var latlon = {lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude)};

	// tell server users location
	$.post(window.location.href, {reason: "setuserlocation", location: latlon},
		function(data, status){
			if (data == "fail") {
				console.log("Could not tell server users location")
			}
		}
	);
	
	// create map and add user marker
	var homeMap = new google.maps.Map(document.getElementById('map'), { zoom: 15, center: latlon, disableDefaultUI: true}); 
	img = window.location.href + "/img/user pin.png"
	var marker = new google.maps.Marker({
		position: latlon, 
		map: homeMap, 
		icon: img
	}); 

	// add pubs to map
	displayPubs(homeMap);

}
			
function displayPubs(paramMap) {
	// add pub locations
	var markerArray = [];
	var infoArray = [];
	var infowindow = new google.maps.InfoWindow
	for (i = 0; i < pubs.length; i++) {
		var latlon = {lat: parseFloat(pubs[i].lat), lng: parseFloat(pubs[i].lng)};
		var marker = new google.maps.Marker({position: latlon, map: paramMap, url: window.location.href + "pubs/" + pubs[i].url});
		infoArray.push(infowindow)
		google.maps.event.addListener(marker, 'click', (function(marker,i) {
			return function() {
				infowindow.setContent(pubs[i].name +  '<BR/>' + 'Double click to view this pub.')
				infowindow.open(map, marker);
			}
		})(marker,i));
		google.maps.event.addListener(marker, 'dblclick', function() {
			window.location.href = this.url;
		});
		markerArray.push(marker)
		
		
	}
}