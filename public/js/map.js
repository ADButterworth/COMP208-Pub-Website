function initMap() { 
	var script_tag = document.getElementById('boi')
	var location = {lat: parseFloat(script_tag.getAttribute("lat")), lng: parseFloat(script_tag.getAttribute("lng"))}; 
	var map = new google.maps.Map(document.getElementById('map'), { zoom: 100, center: location }); 
	var marker = new google.maps.Marker({ position: location, map: map }); 
}