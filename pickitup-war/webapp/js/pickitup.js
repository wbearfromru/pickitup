/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var initialLocation;
var browserSupportFlag =  new Boolean();
var marker = null;
var map = null;
var markers = [];
var timeSpan = 0;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function nearMeMaps(data){
	data = JSON.parse(data);
	
	var map = initialize();
       
    google.maps.event.addListener(map, 'center_changed', function() {
    	getEvents(map);
      });
    google.maps.event.addListener(map, 'zoom_changed', function() {
    	getEvents(map);
    });
}

var updateGamesTimeOut = null;

function getEvents(map){
	if (typeof map == 'undefined' || typeof map.getBounds() == 'undefined')
		return;
	
	if (updateGamesTimeOut != null)
		clearTimeout(updateGamesTimeOut);
	
	updateGamesTimeOut = setTimeout(refreshMap, 200);
}

function setTimeSpan(el, span) {
	$(el).parent().parent().children().removeClass('active');
	$(el).parent().addClass('active');
	timeSpan = span; 
	refreshMap();
}

function refreshMap(){
	$.get( "/seam/resource/rest/games/list", { 
		fromX: map.getBounds().getSouthWest().lng(), 
		toX: map.getBounds().getNorthEast().lng(), 
		fromY: map.getBounds().getSouthWest().lat(), 
		toY: map.getBounds().getNorthEast().lat(),
		ts: timeSpan})
  .done(function( data ) {
	
	var results = JSON.parse(data);
	var rendered = '';
	var newMarkers = [];
	for (var i = 0; i < results.length; i++){
		var game = results[i];
		var template = $('#gameTemplate').html();
		Mustache.parse(template);   // optional, speeds up future uses
		rendered += Mustache.render(template, game);
		newMarkers.push(addMarker(new google.maps.LatLng(game.lat, game.lng),game.name,game.uniqueId ));
	}
	clearMarkers();
	markers = newMarkers;
	showAllMarkers();
	$('#list').html(rendered);
  });
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
		zoom : 5,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map-canvas"),
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
			    $("#createGame\\:lat").val(marker.position.lat());
		        $("#createGame\\:lng").val(marker.position.lng());
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



//Add a marker to the map and push to the array.
function addMarker(location, title, link) {
  var marker = new google.maps.Marker({
    position: location,
    title: title,
    map: map,
  });
  google.maps.event.addListener(marker, 'click', function() {
	    map.setCenter(marker.getPosition());
  });
  return marker;
}

// Sets the map on all markers in the array.
function showAllMarkers() {
	setAllMap(map);
}

function setAllMap(map){
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
	}
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setAllMap(null);
  markers = [];
}