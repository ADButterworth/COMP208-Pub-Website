function findYou(){
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		console.log('Not found you');
	}
}
function showPosition(position) {
	console.log(position)
	console.log(`${latlngs}`)
	var latlon = {lat: parseFloat(position.coords.latitude), lng: parseFloat(position.coords.longitude)};
	var map = new google.maps.Map(document.getElementById('map'), { zoom: 15, center: latlon }); 
	var marker = new google.maps.Marker({ position: latlon, map: map }); 
	addPubs(#{latlngs}); 
}
function addPubs(latlngs){
	console.log('In addPubs')
	var markerArray = [];
	for (i = 0; i<latlngs.length; i++)
		var latlon = {lat: parseFloat(latlngs[i].lat), lng: parseFloat(latlngs[i].lng)};
		markerArray.push(new google.maps.Marker({position: latlon, map:map}));
}