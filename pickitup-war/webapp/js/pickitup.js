/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var initialLocation;
var browserSupportFlag =  new Boolean();
var marker = null;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function nearMeMaps(data){
	data = JSON.parse(data);
	
	var map = initialize();
       
    for (var i = 0; i < data.locations.length; i++){
    	var location = data.locations[i];
    	 var marker = new google.maps.Marker({
    	        position: new google.maps.LatLng(location.lat, location.lng),
    	        title:"Hello World!",
    	        icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld='+letters.charAt(i)+'|AE4D4D|000000',
    	    });
        marker.setMap(map);
    };
}

function createGameMaps(){
	initialize();
}

function createGameMapsDynamic(){
    var map = initialize(true);
 
    $("#locateLocationBtn").click(function(){
        codeAddress(map, marker);
    });
    
    google.maps.event.addListener(map, "click", function (event) {
        marker.setPosition(event.latLng);
        $("#createGame\\:lat").val(marker.position.lat());
        $("#createGame\\:lng").val(marker.position.lng());
    });
}

function codeAddress(map, marker) {
    var geocoder = new google.maps.Geocoder();
    var address = $("#locateLocation").val();
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
            $("#createGame\\:lat").val(results[0].geometry.location.lat());
            $("#createGame\\:lng").val(results[0].geometry.location.lng());
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}



function getPlayerCal(){
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $('#calendar').fullCalendar({
            editable: true,
            events: [
                    {
                            id: 999,
                            title: 'Wednesday Lunch BBall',
                            start: new Date(y, m, d-4, 16, 0),
                            allDay: false
                    },
                    {
                            id: 999,
                            title: 'Wednesday Lunch BBall',
                            start: new Date(y, m, d+3, 16, 0),
                            allDay: false
                    },
                    {
                            title: 'Sat BBall',
                            start: new Date(y, m, d-1, 10, 30),
                            allDay: false
                    },
                    {
                            title: 'Sunday Evening BBall',
                            start: new Date(y, m, d, 19, 0),
                            end: new Date(y, m, d, 22, 30),
                            allDay: false
                    },
                    {
                            title: 'BBall Tournament',
                            start: new Date(y, m, 28),
                            end: new Date(y, m, 29),
                            url: 'http://google.com/'
                    }
            ]
    });

}



function initialize(addMarker) {
	

	var myOptions = {
		zoom : 14,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById("map-canvas"),
			myOptions);

	// Try W3C Geolocation (Preferred)
	if (navigator.geolocation) {
		browserSupportFlag = true;
		navigator.geolocation.getCurrentPosition(function(position) {
			initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			map.setCenter(initialLocation);
			if (addMarker){
				marker = new google.maps.Marker({
			        position: initialLocation,
			        icon: 'http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=A|AE4D4D|000000'
			    });
			    marker.setMap(map);
			}
		}, function() {
			handleNoGeolocation(browserSupportFlag);
		});
	}
	// Browser doesn't support Geolocation
	else {
		browserSupportFlag = false;
		handleNoGeolocation(browserSupportFlag);
	}

	return map;

	function handleNoGeolocation(errorFlag) {
		var siberia = new google.maps.LatLng(60, 105);
		var newyork = new google.maps.LatLng(40.69847032728747, -73.9514422416687);
		
		if (errorFlag == true) {
			alert("Geolocation service failed.");
			initialLocation = newyork;
		} else {
			alert("Your browser doesn't support geolocation. We've placed you in Siberia.");
			initialLocation = siberia;
		}
		map.setCenter(initialLocation);
	}
}