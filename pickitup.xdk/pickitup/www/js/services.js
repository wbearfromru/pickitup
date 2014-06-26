'use strict';

/* Services */
var services = angular.module('services', ['ngResource']); 

var server = 'http://pickitupbasketball.co/v2';

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

services.factory('AuthService', [ '$http', '$window', '$location', function($http, $window, $location) {
	return {
		login : function(credentials) {
			return $http.post(server + '/login', {
				username : credentials.username,
				password : credentials.password
			});
		},
		logout : function() {
			delete $window.sessionStorage.isAuthenticated;
			$location.path("/");
		},
		isAuthenticated : function() {
			return $window.sessionStorage.isAuthenticated;
		},

		login_fb : function(userId) {
			return $http.post(server + '/login_fb', {
				fb_id : userId
			});
		},
		init_fb: function(){
			$window.fbAsyncInit = function() {
				FB.init({
					appId : '1432974593617773',
					status : true,
					cookie : true,
					xfbml : true
				});
			};

			(function(d) {
				var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
				if (d.getElementById(id)) {
					return;
				}
				js = d.createElement('script');
				js.id = id;
				js.async = true;
				js.src = "//connect.facebook.net/en_US/all.js";

				ref.parentNode.insertBefore(js, ref);

			}(document));
		},
		signup: function(user){
			return $http.post(server + '/signup', {
				firstname: user.firstname,
				lastname: user.lastname,
				email: user.email,
				password: user.password,
				description: user.description,
				playerSex: user.sex,
				dateOfBirth: user.dateOfBirth,
			});
		},
		signup_fb: function(user, picture){
			return $http.post(server + '/signup_fb', {
				firstname : user.first_name,
				lastname : user.last_name,
				email : user.email,
				fb_id : user.id,
				description : user.about,
				playerSex : user.gender,
				dateOfBirth : user.birthday,
				picture : picture.data.url,
			});
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
		var _self = this;
		_self.setAllMap(null);
		service.markers = [];
	};
	
	service.setAllMap = function(map){
		for (var i = 0; i < service.markers.length; i++) {
			service.markers[i].setMap(map);
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


