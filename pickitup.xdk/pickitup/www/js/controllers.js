'use strict';

/* Controllers */
var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('NavigationCtrl', [ '$scope', '$window', 'AuthService', function($scope, $window, AuthService) {
	$scope.AuthService = AuthService;
} ]);


phonecatControllers.controller('HomeCtrl', [ '$scope', '$window', 'AuthService', function($scope, $window, AuthService) {
	$scope.AuthService = AuthService;
} ]);

phonecatControllers.controller('NearMeCtrl', [ '$scope', '$window', 'AuthService', 'GameService', 'Map', function($scope, $window, AuthService, GameService, Map) {
	$scope.AuthService = AuthService;
	$scope.timeSpan = 0;
	$scope.games = [];
	
	$scope.setTimeSpan = function(timeSpan) {
		$scope.timeSpan = timeSpan;
		GameService.getGames(timeSpan).success(function(results) {
			$scope.games = results;
			var newMarkers = [];
			for (var i = 0; i < results.length; i++) {
				var game = results[i];
				newMarkers.push(Map.addMarker(new google.maps.LatLng(game.lat, game.lng), game.name, game.uniqueId));
			}
			Map.clearMarkers();
			Map.setMarkers(newMarkers);
			Map.showAllMarkers();
		});
	};

	Map.createMap('map-canvas');
	
	Map.centerOnUserLocation(function(err, location) {
		$scope.setTimeSpan($scope.timeSpan);
		
		/*google.maps.event.addListener(map, 'center_changed', function() {
			$scope.setTimeSpan($scope.timeSpan);
		});
		
		google.maps.event.addListener(map, 'zoom_changed', function() {
			$scope.setTimeSpan($scope.timeSpan);
		});*/
	});
	

	// $.get( "/count", {
	// fromX: map.getBounds().getSouthWest().lng(),
	// toX: map.getBounds().getNorthEast().lng(),
	// fromY: map.getBounds().getSouthWest().lat(),
	// toY: map.getBounds().getNorthEast().lat()
	// }
	// ).done(function( results ) {
	// $('#games0').html(results.games0);
	// $('#games1').html(results.games1);
	// $('#games2').html(results.games2);
	// $('#games3').html(results.games3);
	// }
	// );
	// }


} ]);

phonecatControllers.controller('CreateGameCtrl', [ '$scope', '$window', 'AuthService','Map', function($scope, $window, AuthService, Map) {
	$scope.AuthService = AuthService;	
	Map.createMap('map-canvas');
	Map.centerOnUserLocation(function(err, location){
		if (err)
			location = map.getCenter();
		marker = Map.addMarker(location);
		//setTrackerLocation(location);
	});
} ]);

phonecatControllers.controller('MyProfileCtrl', [ '$scope', '$window', 'AuthService', function($scope, $window, AuthService) {
	$scope.AuthService = AuthService;
} ]);

phonecatControllers.controller('PhoneDetailCtrl', [ '$scope', '$routeParams', 'Phone', function($scope, $routeParams, Phone) {
	$scope.phone = Phone.get({
		phoneId : $routeParams.phoneId
	}, function(phone) {
		$scope.mainImageUrl = phone.images[0];
	});

	$scope.setImage = function(imageUrl) {
		$scope.mainImageUrl = imageUrl;
	}
} ]);


phonecatControllers.controller('LoginCtrl', [ '$scope', '$routeParams', '$window', 'AuthService', function($scope, $http, $window, AuthService) {
	$scope.credentials = {
		username : '',
		password : ''
	};
	$scope.login = function(credentials) {
		AuthService.login(credentials).
		then(function (data) {
			$window.sessionStorage.isAuthenticated = true;
			$window.sessionStorage.userUniqueId = data.data.userid;
	        $scope.status = 'Success';
	        $scope.data = data;
	        $window.location = '#/home';
	    }, function (data) {
	    	delete $window.sessionStorage.isAuthenticated; 
	    });
	};
} ]);

