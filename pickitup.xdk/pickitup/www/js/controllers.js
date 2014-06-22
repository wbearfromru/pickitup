'use strict';

/* Controllers */
var controllers = angular.module('controllers', []);

controllers.controller('NavigationCtrl', [ '$scope', '$window', 'AuthService', function($scope, $window, AuthService) {
	$scope.AuthService = AuthService;
} ]);

controllers.controller('HomeCtrl', [ '$scope', '$window', '$location', 'AuthService', function($scope, $window, $location, AuthService) {
	$scope.AuthService = AuthService;

	AuthService.init_fb();

	$scope.signUp = function() {
	};

	$scope.signUpFB = function() {
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				proceedFBSignUp();
			} else {
				FB.login(function(response) {
					if (response.authResponse) {
						proceedFBSignUp();
					}
				});
			}
		});
	};

	function proceedFBSignUp() {
		FB.api('/me', function(personaldata) {
			if (!personaldata || personaldata.error)
				return;

			FB.api("/me/picture", function(picturedata) {
				$.post("/v2/signup_fb", {
					firstname : personaldata.first_name,
					lastname : personaldata.last_name,
					email : personaldata.email,
					fb_id : personaldata.id,
					description : personaldata.about,
					playerSex : personaldata.gender,
					dateOfBirth : personaldata.birthday,
					picture : picturedata.data.url,
				}, function(data) {
					$window.sessionStorage.token = data.token;
					$window.sessionStorage.isAuthenticated = true;
					$location.path("/home");
				});
			});
		});
	}
} ]);

controllers.controller('NearMeCtrl', [ '$scope', '$window', 'AuthService', 'PickitUpService', 'Map', function($scope, $window, AuthService, PickitUpService, Map) {
	$scope.AuthService = AuthService;
	$scope.timeSpan = 0;
	$scope.games = [];
	var mapRefreshTimeout = null;

	$scope.setTimeSpan = function(timeSpan) {
		if (typeof mapRefreshTimeout != 'undefined')
			clearTimeout(mapRefreshTimeout);
		
		mapRefreshTimeout = setTimeout(function(){
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
		}, 100);
	};

	$scope.joinGame = function(game) {
		PickitUpService.joinGame(game.uniqueId).success(function() {
			game.alreadyJoined = true;
		});
	};

	$scope.leaveGame = function(game) {
		PickitUpService.leaveGame(game.uniqueId).success(function() {
			game.alreadyJoined = false;
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

controllers.controller('CreateGameCtrl', [ '$scope', '$location', 'AuthService', 'PickitUpService', 'Map', function($scope, $location, AuthService, PickitUpService, Map) {
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
		PickitUpService.submitGame(game).then(function(data) {
			$location.path("/nearme");
		}, function(data) {
			$scope.errors = data.data.errors;
		});
	};

} ]);

controllers.controller('MyProfileCtrl', [ '$scope', '$window', 'AuthService', 'PickitUpService', function($scope, $window, AuthService, PickitUpService) {
	$scope.AuthService = AuthService;

	PickitUpService.myDetails().success(function(data) {
		$scope.player = data.player;
		$scope.games = data.games;

		$('#calendar').fullCalendar({
			editable : true,
			events : data.schedule
		});
	});
} ]);

controllers.controller('GameDetailCtrl', [ '$scope', '$routeParams', 'AuthService', 'PickitUpService', 'Map', function($scope, $routeParams, AuthService, PickitUpService, Map) {
	$scope.AuthService = AuthService;

	PickitUpService.gameInfo($routeParams.uniqueId).success(function(data) {
		$scope.game = data.game;
		$scope.players = data.players;

		Map.createMap('map-canvas');
		var initialLocation = new google.maps.LatLng($scope.game.location.lat, $scope.game.location.lng);
		Map.map.setCenter(initialLocation);
		Map.addMarker(initialLocation, $scope.game.title);
	});
} ]);
controllers.controller('PlayerDetailCtrl', [ '$scope', '$routeParams', 'AuthService', 'PickitUpService', function($scope, $routeParams, AuthService, PickitUpService) {
	$scope.AuthService = AuthService;

	PickitUpService.playerInfo($routeParams.uniqueId).success(function(data) {
		$scope.player = data.player;
	});

} ]);

controllers.controller('LoginCtrl', [ '$scope', '$window', '$location', 'AuthService', function($scope, $window, $location, AuthService) {
	$scope.credentials = {
		username : '',
		password : ''
	};

	AuthService.init_fb();

	$scope.login = function(credentials) {
		AuthService.login(credentials).then(function(data, status, headers, config) {
			$window.sessionStorage.token = data.data.token;
			$window.sessionStorage.isAuthenticated = true;
			$location.path('#/home');
		}, function(data) {
			delete $window.sessionStorage.isAuthenticated;
			delete $window.sessionStorage.token;
		});
	};

	$scope.login_fb = function() {
		FB.getLoginStatus(function(response) {
			if (response.status === 'connected') {
				proceeedFbLogin(response.authResponse.userID);
			} else {
				FB.login(function(response) {
					if (response.authResponse) {
						proceeedFbLogin(response.authResponse.userID);
					}
				});
			}
		});
	};

	function proceeedFbLogin(userId) {
		AuthService.login_fb(userId).then(function(data) {
			console.log(data);
			$window.sessionStorage.token = data.data.token;
			$window.sessionStorage.isAuthenticated = true;
			$location.path("/home");
		}, function() {
			$location.path("/login");
		});
	}
} ]);
