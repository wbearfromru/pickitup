'use strict';

/* Services */
var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Phone', ['$resource',
  function($resource){
    return $resource('phones/:phoneId.json', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
  }]);

phonecatServices.factory('GameService', [ '$http', '$window', 'Map', function($http, $window, Map) {
	return {
		init : function(container) {
			Map.createMap(container);
		},
		getGames : function(timeSpan) {
			return $http.jsonp("http://localhost:3000/list", {
				params : {
					callback : 'JSON_CALLBACK',
					format : 'json',
					fromX : Map.map.getBounds().getSouthWest().lng(),
					toX : Map.map.getBounds().getNorthEast().lng(),
					fromY : Map.map.getBounds().getSouthWest().lat(),
					toY : Map.map.getBounds().getNorthEast().lat(),
					ts : timeSpan,
					userUniqueId: $window.sessionStorage.userUniqueId
				}
			});
		}
	};
} ]);

phonecatServices.factory('AuthService', ['$http', '$window', 'Session', function ($http, $window, Session) {
  return {
    login: function (credentials) {
      return $http.jsonp('http://localhost:3000/login', {
          params: {
              callback: 'JSON_CALLBACK',
              format:'json',
              username: credentials.username,
              password: credentials.password
          }
      });
    },
    logout: function(){
    	delete $window.sessionStorage.isAuthenticated;
    },
    isAuthenticated: function () {
      return $window.sessionStorage.isAuthenticated;
    },
    isAuthorized: function (authorizedRoles) {
      if (!angular.isArray(authorizedRoles)) {
         authorizedRoles = [authorizedRoles];
      }
      return (this.isAuthenticated() && authorizedRoles.indexOf(Session.userRole) !== -1);
    }
  };
} ]);

phonecatServices.service('Session', function() {
	this.create = function(sessionId, userId, userRole) {
		this.id = sessionId;
		this.userId = userId;
		this.userRole = userRole;
	};
	this.destroy = function() {
		this.id = null;
		this.userId = null;
		this.userRole = null;
	};
	return this;
})

phonecatServices.service('Map', function() {
	
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
	this.showAllMarkers = function() {
		service.setAllMap(service.map);
	};

	// Removes the markers from the map, but keeps them in the array.
	this.clearMarkers = function() {
		setAllMap(null);
		service.markers = [];
	};
	
	function setAllMap(map){
		for (var i = 0; i < service.markers.length; i++) {
			service.markers[i].setMap(service.map);
		}
	};
	
	function setMarkers(markers){
		service.clearMarkers();
		service.markers = markers;
		for (var i = 0; i < service.markers.length; i++) {
			service.markers[i].setMap(service.map);
		}
	};
	
	return service;
})


