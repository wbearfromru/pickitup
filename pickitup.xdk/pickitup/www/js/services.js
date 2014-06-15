'use strict';

/* Services */
var services = angular.module('services', ['ngResource']); 

var server = 'http://localhost:3000';

services.factory('PickitUpService', [ '$http', '$window', 'Map', function($http, $window, Map) {
	return {
		init : function(container) {
			Map.createMap(container);
		},
		getGames : function(timeSpan) {
			return $http.get(server+"/api/list", {
				params : {
					fromX : Map.map.getBounds().getSouthWest().lng(),
					toX : Map.map.getBounds().getNorthEast().lng(),
					fromY : Map.map.getBounds().getSouthWest().lat(),
					toY : Map.map.getBounds().getNorthEast().lat(),
					ts : timeSpan,
				}
			});
		},
		getGamesCount : function(){
			return $http.get(server+"/api/count", {
				params : {
					fromX : Map.map.getBounds().getSouthWest().lng(),
					toX : Map.map.getBounds().getNorthEast().lng(),
					fromY : Map.map.getBounds().getSouthWest().lat(),
					toY : Map.map.getBounds().getNorthEast().lat()
				}
			});
		},
		submitGame : function(game){
			return $http.post(server+"/api/creategame", {
				title : game.title,
				startDate : game.startDate,
				duration : game.duration,
				description : game.description,
				lat : game.location.lat,
				lng : game.location.lng
			});
		},
		joinGame : function(uniqueId) {
			return $http.post(server+"/api/nearme/join/" + uniqueId, {
			});
		},
		leaveGame : function(uniqueId) {
			return $http.post(server+"/api/nearme/leave/" + uniqueId, {
			});
		},
		gameInfo : function(uniqueId) {
			return $http.get(server+"/api/game/"+uniqueId, {
			});
		}, 
		playerInfo : function(uniqueId) {
			return $http.get(server+"/api/player/"+uniqueId, {
			});
		}, 
		myDetails : function(){
			return $http.get(server+"/api/me");
		}
	};
} ]);

services.factory('AuthService', ['$http', '$window', function ($http, $window) {
  return {
    login: function (credentials) {
      return $http.post(server+'/login', {
          username: credentials.username,
          password: credentials.password
      });
    },
    logout: function(){
    	delete $window.sessionStorage.isAuthenticated;
    	$location.path("/");
    },
    isAuthenticated: function () {
      return $window.sessionStorage.isAuthenticated;
    }
  };
} ]);




services.service('Map', function() {
	
	var service = this;
	
	service.markers = [];
	service.createMap = function(mapContainer) {
		var defaultMapOptions = {
			zoom : 13,
			mapTypeId : google.maps.MapTypeId.ROADMAP
		};
		service.map = new google.maps.Map(document.getElementById(mapContainer), defaultMapOptions);
		return service.map;
	};
	
	service.centerOnUserLocation = function(callback){
		// Try W3C Geolocation (Preferred)
		if (!navigator.geolocation) 
			return;
		
		navigator.geolocation.getCurrentPosition(function(position) {
			var initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			service.map.setCenter(initialLocation);
			callback(null, initialLocation);
		}, function() {
			callback("Geonavigation service failed");
		});
	}

	//Add a marker to the map and push to the array.
	service.addMarker = function(location, title, link) {
		var marker = new google.maps.Marker({
			position : location,
			title : title,
			map : service.map,
		});
		google.maps.event.addListener(marker, 'click', function() {
			service.map.setCenter(marker.getPosition());
		});
		return marker;
	};

	// Sets the map on all markers in the array.
	service.showAllMarkers = function() {
		service.setAllMap(service.map);
	};

	// Removes the markers from the map, but keeps them in the array.
	service.clearMarkers = function() {
		setAllMap(null);
		service.markers = [];
	};
	
	service.setAllMap = function(map){
		for (var i = 0; i < service.markers.length; i++) {
			service.markers[i].setMap(service.map);
		}
	};
	
	service.setMarkers = function(markers){
		service.clearMarkers();
		service.markers = markers;
		for (var i = 0; i < service.markers.length; i++) {
			service.markers[i].setMap(service.map);
		}
	};
	
	return service;
})


