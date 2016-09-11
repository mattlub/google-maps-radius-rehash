$(document).ready(function() {

	function initMap() {

		var NUMBER = 10;
		var RADIUS = 20000;
		var searchLocs = [];
		var spherical = google.maps.geometry.spherical;
		var myLoc = new google.maps.LatLng(51.5, -0.12);
		var mapOptions = {
			zoom: 9,
			center: myLoc
		}

		// get search centre locations
		for (var i = 0; i < NUMBER; i++) {
			searchLocs[i] = spherical.computeOffset(myLoc, RADIUS, i * 360 / NUMBER);
			console.log(i, "th search loc computed");
		}
	}
	
	var geocoder = new google.maps.Geocoder();

	function geocodeAddress(geocoder, resultsMap) {
		var address = document.getElementById('address').value;
		geocoder.geocode({
			'address': address
		}, function(results, status) {
			if (status === 'OK') {
				resultsMap.setCenter(results[0].geometry.location);
				var marker = new google.maps.Marker({
					map: resultsMap,
					position: results[0].geometry.location
				});
			} else {
				alert('Geocode was not successful for the following reason: ' + status);
			}
		});
	};

	var map = new google.maps.Map(document.getElementById("map"), mapOptions);

	document.getElementById('submit').addEventListener('click', function() {
		geocodeAddress(geocoder, map);
	});

	infowindow = new google.maps.InfoWindow();

	var service = new google.maps.places.PlacesService(map);

	for (var i = 0; i < NUMBER; i++) {
		service.nearbySearch({
			location: searchLocs[i],
			radius: 2000,
			//type: ['store']
			type: ['post_office']
		}, searchCallback);
		console.log(i, "th search conducted.");
	}

	var homemarker = new google.maps.Marker({
		position: myLoc,
		title: "Hello World!"
	});

	function searchCallback(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				createMarker(results[i]);
			}
		}
	}

	function createMarker(place) {
		var placeLoc = place.geometry.location;
		var marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location
		});

		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent(place.name);
			infowindow.open(map, this);
		});
	}

});