'use strict';

/* Controllers */
var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('NavigationCtrl', [ '$scope', '$window', 'AuthService', function($scope, $window, AuthService) {
	$scope.AuthService = AuthService;
} ]);


phonecatControllers.controller('HomeCtrl', [ '$scope', '$window', 'AuthService', function($scope, $window, AuthService) {
	$scope.AuthService = AuthService;
} ]);

phonecatControllers.controller('NearMeCtrl', [ '$scope', '$window', 'AuthService', 'PickitUpService', 'Map', function($scope, $window, AuthService, PickitUpService, Map) {
	$scope.AuthService = AuthService;
	$scope.timeSpan = 0;
	$scope.games = [];
	
	$scope.setTimeSpan = function(timeSpan) {
		$scope.timeSpan = timeSpan;
		PickitUpService.getGames(timeSpan).success(function(results) {
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
		PickitUpService.getGamesCount().success(function(results) {
			$scope.games0 = results.games0;
			$scope.games1 = results.games1;
			$scope.games2 = results.games2;
			$scope.games3 = results.games3;
		});
	};

	Map.createMap('map-canvas');
	
	Map.centerOnUserLocation(function(err, location) {
		$scope.setTimeSpan($scope.timeSpan);
		
		google.maps.event.addListener(Map.map, 'center_changed', function() {
			$scope.setTimeSpan($scope.timeSpan);
		});
		
		google.maps.event.addListener(Map.map, 'zoom_changed', function() {
			$scope.setTimeSpan($scope.timeSpan);
		});
	});
	
} ]);

phonecatControllers.controller('CreateGameCtrl', [ '$scope', '$location', 'AuthService','PickitUpService', 'Map', function($scope, $location, AuthService, PickitUpService, Map) {
	$scope.AuthService = AuthService;
	$scope.game = {};
	$scope.game.location = {};
	$scope.setTrackerLocation = function(location) {
		$scope.game.location.lat = location.lat();
		$scope.game.location.lng = location.lng();
	};

	$scope.marker = null;
	Map.createMap('map-canvas');
	Map.centerOnUserLocation(function(err, location) {
		if (err)
			location = Map.map.getCenter();

		$scope.marker = Map.addMarker(location);
		$scope.setTrackerLocation(location);
	});

	$("#locateLocationBtn").click(function() {
		codeAddress(Map.map, $scope.marker);
	});

	google.maps.event.addListener(Map.map, "click", function(event) {
		$scope.marker.setPosition(event.latLng);
		$scope.setTrackerLocation(event.latLng);
	});

	$('#startDatePicker').datetimepicker({}).on('dp.change,dp.show', function(e) {
		$(this).find('input').change();
	});

	$('#durationPicker').datetimepicker({
		pickDate : false,
		defaultDate : "02:00",
	}).on('dp.change,dp.show', function(e) {
		$(this).find('input').change();
	});

	$scope.submitGame = function(game) {
		PickitUpService.submitGame(game).then(
			function(data){
				$location.path("/nearme");
			}, function(data){
				$scope.errors = data.data.errors;
			}
		);
	};

} ]);

phonecatControllers.controller('MyProfileCtrl', [ '$scope', '$window', 'AuthService', 'PickitUpService', function($scope, $window, AuthService, PickitUpService) {
	$scope.AuthService = AuthService;
	
	PickitUpService.myDetails().success(function(data){
		$scope.player = data.data.player;
		$scope.games = data.data.games;
		
	    $('#calendar').fullCalendar({
	        editable: true,
	    	events: data.data.schedule
	    });
	});
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


phonecatControllers.controller('LoginCtrl', [ '$scope', '$window', '$location', 'AuthService', function($scope, $window,$location, AuthService) {
	$scope.credentials = {
		username : '',
		password : ''
	};
	$scope.login = function(credentials) {
		AuthService.login(credentials).
		then(function (data, status, headers, config) {
	        $window.sessionStorage.token = data.data.token;
			$window.sessionStorage.isAuthenticated = true;
			$location.path('#/home');
	    }, function (data) {
	    	delete $window.sessionStorage.isAuthenticated;
	    	delete $window.sessionStorage.token;
	    });
	};
} ]);

