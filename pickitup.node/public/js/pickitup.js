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

function nearMeMaps(){
	map = Tools.initializeMap('map-canvas');
	centerMapOnCurrentLocation(function(err,location){
		
	});
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
	$.get( "/list", { 
		fromX: map.getBounds().getSouthWest().lng(), 
		toX: map.getBounds().getNorthEast().lng(), 
		fromY: map.getBounds().getSouthWest().lat(), 
		toY: map.getBounds().getNorthEast().lat(),
		ts: timeSpan})
  .done(function( results ) {
	
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
	$.get( "/count", { 
		fromX: map.getBounds().getSouthWest().lng(), 
		toX: map.getBounds().getNorthEast().lng(), 
		fromY: map.getBounds().getSouthWest().lat(), 
		toY: map.getBounds().getNorthEast().lat()
		}
	).done(function( results ) {
		$('#games0').html(results.games0);
		$('#games1').html(results.games1);
		$('#games2').html(results.games2);
		$('#games3').html(results.games3);
	  }
	);
}

function createGameMapsDynamic(){
	map = Tools.initializeMap('map-canvas');
    var marker = null;
    if (isTrackerLocationSet()){
    	var location=getTrackerLocation();
		map.setCenter(location);
		marker = putMarker(location);
    } else {
    	centerMapOnCurrentLocation(function(err, location){
    		if (err)
    			location = map.getCenter();
    		marker = putMarker(location);
    		setTrackerLocation(location);
    	});
    }
 
    $("#locateLocationBtn").click(function(){
        codeAddress(map, marker);
    });
    
    google.maps.event.addListener(map, "click", function (event) {
        marker.setPosition(event.latLng);
        setTrackerLocation(event.latLng);
    });
}

function codeAddress(map, marker) {
    var geocoder = new google.maps.Geocoder();
    var address = $("#locateLocation").val();
    geocoder.geocode({ 'address': address }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
            setTrackerLocation(results[0].geometry.location);
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

function centerMapOnCurrentLocation(callback){
	// Try W3C Geolocation (Preferred)
	if (!navigator.geolocation) 
		return;
	
	navigator.geolocation.getCurrentPosition(function(position) {
		var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		map.setCenter(initialLocation);
		callback(null, initialLocation);
	}, function() {
		callback("Geonavigation service failed");
	});
}

function putMarker(location){
	var marker = new google.maps.Marker({
        position: location,
    });
    marker.setMap(map);
    return marker;
}

// Tracker utils
function isTrackerLocationSet(){
	var lat=$('#lat').val();
	return (typeof lat != 'undefined' && lat.length > 0);
}

function setTrackerLocation(location){
    $("#lat").val(location.lat());
    $("#lng").val(location.lng());
}

function getTrackerLocation(){
	return  new google.maps.LatLng($("#lat").val(), $("#lng").val());
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