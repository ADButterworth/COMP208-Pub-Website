function getUserLocation(){
	// check if position avalible
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(location) {

			var latlon = {lat: parseFloat(location.coords.latitude), lng: parseFloat(location.coords.longitude)};

			$.post(window.location.href, {reason: "setuserlocation", location: latlon},
				function(data, status){
					if (data == "fail") {
						console.log("Could not tell server users location")
					}
				}
			);
		});
	}
}