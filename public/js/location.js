function findYou(){
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		console.log('Not found you');
	}
}
function showPosition(position) {
	console.log('We are here')
	console.log(position)
	var latlon = {lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude)};
	var map = new google.maps.Map(document.getElementById('map'), { zoom: 15, center: latlon }); 
	var marker = new google.maps.Marker({ position: latlon, map: map }); 
}